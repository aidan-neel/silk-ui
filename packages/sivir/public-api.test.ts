/**
 * Phase 2 §1 — lock the public API.
 *
 * Frozen catalog: 55 components. Named exports hang off the package root as
 * identifiers; namespace exports hang off a PascalCase object (AlertDialog.Root).
 * Every public component is also reachable at @sivir-ui/svelte/components/<slug>.
 */
import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadRegistryIndex } from './cli/registry';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.join(packageRoot, 'src/components');

/** Single-element components: `import { Button } from '@sivir-ui/svelte'`. */
const NAMED = {
    badge: ['Badge'],
    button: ['Button'],
    checkbox: ['Checkbox'],
    'code-block': ['CodeBlock'],
    'copy-button': ['CopyButton'],
    gauge: ['Gauge'],
    input: ['Input'],
    label: ['Label'],
    markdown: ['Markdown'],
    pagination: ['Pagination'],
    progress: ['Progress'],
    'reorder-list': ['ReorderList'],
    'scroll-area': ['ScrollArea'],
    'show-more': ['ShowMore'],
    shortcut: ['Shortcut'],
    skeleton: ['Skeleton', 'SkeletonSwap'],
    slider: ['Slider'],
    spinner: ['Spinner'],
    switch: ['Switch'],
    'task-steps': ['TaskSteps'],
    textarea: ['Textarea'],
    'response-stream': ['ResponseStream'],
    toast: ['Toast', 'Toaster', 'toast', 'getToastUIState'],
    toggle: ['Toggle'],
    toolbar: ['Toolbar']
} as const;

/** Compound components: `import { Modal } from '@sivir-ui/svelte'` then `<Modal.Root>`. */
const NAMESPACED = {
    accordion: ['Root', 'Item', 'Trigger', 'Content'],
    alert: ['Root', 'Title', 'Description'],
    'alert-dialog': [
        'Root',
        'Trigger',
        'Content',
        'Header',
        'Title',
        'Description',
        'Exit',
        'Footer',
        'Confirm'
    ],
    'approval-request': [
        'Root',
        'Content',
        'Header',
        'Status',
        'Icon',
        'Risk',
        'Title',
        'Description',
        'Details',
        'Footer',
        'Cancel',
        'Confirm'
    ],
    attachment: ['Root', 'Trigger', 'List', 'Item'],
    avatar: ['Root', 'Image', 'Fallback'],
    breadcrumb: ['Root', 'Item', 'Separator'],
    card: ['Root', 'Title', 'Header', 'Footer', 'Description', 'Content'],
    collapsible: ['Root', 'Trigger', 'Content'],
    'color-picker': ['Root', 'Trigger', 'Content'],
    combobox: ['Root', 'Content', 'Trigger', 'Results', 'Item', 'Label'],
    command: ['Root', 'Content', 'Trigger', 'Separator', 'Results', 'Search', 'Item', 'Group'],
    conversation: ['Root', 'Content', 'Empty', 'ScrollButton'],
    'context-menu': [
        'Root',
        'Content',
        'CheckboxItem',
        'Item',
        'Separator',
        'SubContent',
        'SubTrigger',
        'Sub',
        'Trigger'
    ],
    'dropdown-menu': [
        'Root',
        'Trigger',
        'Label',
        'Item',
        'Content',
        'Separator',
        'Sub',
        'SubContent',
        'SubTrigger'
    ], // cone: Root → Sub → nested Sub
    'fullscreen-nav': ['Root', 'Trigger', 'Content', 'Close', 'Group', 'Link'],
    'hover-card': ['Root', 'Trigger', 'Content', 'Title', 'Description'],
    message: ['Root', 'Content', 'Actions'],
    modal: [
        'Root',
        'Trigger',
        'Content',
        'Title',
        'Description',
        'Header',
        'Body',
        'Close',
        'Footer',
        'Confirm'
    ],
    popover: ['Root', 'Trigger', 'Content', 'Title'],
    'prompt-composer': ['Root', 'Input', 'Toolbar', 'Actions', 'Submit'],
    question: [
        'Root',
        'Title',
        'Description',
        'Options',
        'Option',
        'Input',
        'Actions',
        'Cancel',
        'Submit'
    ],
    'radio-group': ['Root', 'Item'],
    reasoning: ['Root', 'Trigger', 'Content'],
    select: ['Root', 'Trigger', 'Value', 'Label', 'Item', 'Content'],
    sheet: ['Root', 'Trigger', 'Title', 'Header', 'Footer', 'Description', 'Content', 'Close'],
    tabs: ['Root', 'List', 'Trigger', 'Content'],
    tool: ['Root', 'Item', 'Input', 'Output'],
    'toggle-group': ['Root', 'Item'],
    tooltip: ['Root', 'Content', 'Trigger']
} as const;

/** Parts available on the direct path even when the barrel only re-exports a shorthand. */
const DIRECT_PARTS = {
    ...NAMESPACED,
    'code-block': ['Root', 'Header', 'List', 'Trigger', 'Actions', 'Copy', 'Content', 'CodeBlock'],
    card: ['Root', 'Title', 'Header', 'Footer', 'Description', 'Content']
} as const;

const FROZEN = [...Object.keys(NAMED), ...Object.keys(NAMESPACED)].sort((a, b) =>
    a.localeCompare(b)
);
const NON_INSTALLABLE = ['toolbar'];
const INSTALLABLE = FROZEN.filter((name) => !NON_INSTALLABLE.includes(name));

const REMOVED = ['marquee', 'panel', 'separator'] as const;

function toPascalCase(slug: string) {
    return slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function parseExportedNames(source: string): string[] {
    const names = new Set<string>();
    for (const block of source.matchAll(/export\s*\{([^}]+)\}/g)) {
        for (const part of block[1].split(',')) {
            let cleaned = part.replace(/\btype\b/g, '').trim();
            if (!cleaned) continue;
            // `default as CodeBlock` / `Foo as Bar` → public name is the right-hand side.
            if (/\bas\b/.test(cleaned)) {
                cleaned =
                    cleaned
                        .split(/\bas\b/)
                        .at(-1)
                        ?.trim() ?? '';
            } else {
                cleaned = cleaned.replace(/\bdefault\b/g, '').trim();
            }
            if (cleaned) names.add(cleaned);
        }
    }
    for (const match of source.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/g)) {
        names.add(match[1]);
    }
    for (const match of source.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g)) {
        names.add(match[1]);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
}

describe('public API contract (v1 freeze)', () => {
    test('frozen catalog is exactly 55 components with no overlap', () => {
        expect(FROZEN).toHaveLength(55);
        expect(new Set(FROZEN).size).toBe(55);
        for (const slug of Object.keys(NAMED)) {
            expect(NAMESPACED).not.toHaveProperty(slug);
        }
    });

    test('package component directories match the frozen catalog', async () => {
        const dirs = (await readdir(componentsDir, { withFileTypes: true }))
            .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
            .map((entry) => entry.name)
            .sort((a, b) => a.localeCompare(b));

        expect(dirs).toEqual(FROZEN);
        for (const removed of REMOVED) {
            expect(dirs).not.toContain(removed);
            expect(existsSync(path.join(componentsDir, removed))).toBe(false);
        }
    });

    test('root barrel exports every named and namespaced component', async () => {
        const barrel = await readFile(path.join(packageRoot, 'src/index.ts'), 'utf8');

        for (const [slug, symbols] of Object.entries(NAMED)) {
            for (const symbol of symbols) {
                expect(barrel).toMatch(
                    new RegExp(
                        `export\\s*\\{[^}]*\\b${symbol}\\b[^}]*\\}\\s*from\\s*['"]\\./components/${slug}['"]`
                    )
                );
            }
        }

        for (const slug of Object.keys(NAMESPACED)) {
            const pascal = toPascalCase(slug);
            expect(barrel).toContain(`export * as ${pascal} from './components/${slug}'`);
        }

        for (const removed of REMOVED) {
            expect(barrel).not.toContain(`./components/${removed}`);
        }
    });

    test('direct component entrypoints export the locked public parts', async () => {
        for (const slug of FROZEN) {
            const indexPath = path.join(componentsDir, slug, 'index.ts');
            expect(existsSync(indexPath)).toBe(true);
            const source = await readFile(indexPath, 'utf8');
            const exported = parseExportedNames(source);
            const expected =
                DIRECT_PARTS[slug as keyof typeof DIRECT_PARTS] ??
                NAMED[slug as keyof typeof NAMED];
            if (!expected) {
                throw new Error(`Missing public API contract for ${slug}`);
            }
            for (const part of expected) {
                expect(exported, `${slug} missing ${part}`).toContain(part);
            }
        }
    });

    test('package exports map covers every public component path', async () => {
        const packageJson = JSON.parse(
            await readFile(path.join(packageRoot, 'package.json'), 'utf8')
        ) as { exports: Record<string, unknown> };

        expect(packageJson.exports['./components/*']).toMatchObject({
            types: './dist/svelte/components/*/index.d.ts',
            svelte: './dist/svelte/components/*/index.js',
            default: './dist/svelte/components/*/index.js'
        });
        expect(packageJson.exports['.']).toBeTruthy();
        expect(packageJson.exports['./ui.css']).toBe('./dist/svelte/ui.css');

        for (const slug of FROZEN) {
            expect(existsSync(path.join(componentsDir, slug, 'index.ts'))).toBe(true);
        }
    });

    test('CLI registry public list matches the frozen catalog', async () => {
        const snapshot = await loadRegistryIndex();
        const publicNames = snapshot.components
            .filter((component) => component.visibility === 'public')
            .map((component) => component.name)
            .sort((a, b) => a.localeCompare(b));

        expect(publicNames).toEqual(INSTALLABLE);
        for (const removed of REMOVED) {
            expect(publicNames).not.toContain(removed);
        }

        for (const slug of INSTALLABLE) {
            const plan = resolveInstallable(snapshot, slug);
            expect(plan).toBe(slug);
        }
    });

    test('the panel surface is a stylesheet contract, not a shared class string', async () => {
        const css = await readFile(path.join(packageRoot, 'src/ui.css'), 'utf8');
        const cardRoot = await readFile(path.join(componentsDir, 'card/card.svelte'), 'utf8');
        const codeBlock = await readFile(
            path.join(componentsDir, 'code-block/code-block.svelte'),
            'utf8'
        );

        expect(css).toContain('.sivir-card-frame');
        expect(css).toContain('.sivir-card-surface');
        expect(existsSync(path.join(componentsDir, 'card/surface.ts'))).toBe(false);

        for (const source of [cardRoot, codeBlock]) {
            expect(source).toContain('sivir-card-frame');
            expect(source).toContain('sivir-card-surface');
            expect(source).not.toContain('CARD_PANEL_');
        }

        expect(cardRoot).toMatch(/variant\s*=\s*['"]default['"]/);
        expect(cardRoot).toContain("'panel'");
    });

    test('shared surface contracts live in CSS rather than TypeScript', async () => {
        const css = await readFile(path.join(packageRoot, 'src/ui.css'), 'utf8');
        expect(css).toContain('.sivir-menu-item');
        expect(css).toContain('.sivir-tooltip');

        const menuRows = [
            'select/select-item.svelte',
            'combobox/combobox-item.svelte',
            'command/command-item.svelte',
            'context-menu/context-menu-item.svelte',
            'context-menu/context-menu-checkbox-item.svelte',
            'context-menu/context-menu-sub-trigger.svelte',
            'dropdown-menu/dropdown-menu-item.svelte',
            'dropdown-menu/dropdown-menu-sub-trigger.svelte'
        ];
        for (const file of menuRows) {
            const source = await readFile(path.join(componentsDir, file), 'utf8');
            expect(source, file).toContain('sivir-menu-item');
            expect(source, file).toContain('unstyled');
            expect(source, file).not.toContain('MENU_ITEM');
        }

        expect(existsSync(path.join(packageRoot, 'src/internals'))).toBe(false);
    });
});

function resolveInstallable(snapshot: Awaited<ReturnType<typeof loadRegistryIndex>>, slug: string) {
    const entry = snapshot.components.find((component) => component.name === slug);
    if (!entry) {
        throw new Error(`Missing registry entry for ${slug}`);
    }
    expect(entry.visibility).toBe('public');
    return entry.name;
}
