import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import {
    BASE_PEER_DEPENDENCIES,
    installableFiles,
    loadRegistryIndex,
    loadRegistryThemes,
    ResolveError,
    registryFilePath,
    resolveInstallPlan,
    rewriteImports,
    suggestComponent
} from './registry';
import type { RegistryComponent, RegistryIndex } from './types';

function component(overrides: Partial<RegistryComponent>): RegistryComponent {
    return {
        name: 'button',
        version: '1.0.0',
        visibility: 'public',
        files: [],
        components: [],
        shared: [],
        sharedFiles: [],
        peerDependencies: {},
        ...overrides
    };
}

function index(components: RegistryComponent[]): RegistryIndex {
    return { cliVersion: '0.0.0', builtAt: 'test', components };
}

describe('resolveInstallPlan', () => {
    const fixture = index([
        component({ name: 'button', peerDependencies: { svelte: '^5.0.0', clsx: '^2.0.0' } }),
        component({ name: 'popover', components: ['button'] }),
        component({
            name: 'command',
            components: ['popover', 'button'],
            peerDependencies: { 'fuse.js': '^7.0.0' }
        }),
        component({ name: '_internal/overlay', visibility: 'internal' }),
        component({ name: 'modal', components: ['button', '_internal/overlay'] })
    ]);

    test('resolves transitive dependencies once', () => {
        const plan = resolveInstallPlan(fixture, ['command']);
        expect(plan.components.map((c) => c.name)).toEqual(['command', 'popover', 'button']);
    });

    test('pulls internal components as dependencies', () => {
        const plan = resolveInstallPlan(fixture, ['modal']);
        expect(plan.components.map((c) => c.name)).toContain('_internal/overlay');
    });

    test('rejects internal components as direct targets', () => {
        expect(() => resolveInstallPlan(fixture, ['_internal/overlay'])).toThrow(ResolveError);
    });

    test('rejects unknown components with a suggestion', () => {
        expect(() => resolveInstallPlan(fixture, ['bttn'])).toThrow('did you mean "button"');
    });

    test('unions peer dependencies across the plan', () => {
        const plan = resolveInstallPlan(fixture, ['command']);
        expect(Object.keys(plan.peerDependencies).sort()).toEqual(['clsx', 'fuse.js', 'svelte']);
    });

    test('expands * to every public component without exposing internals directly', () => {
        const plan = resolveInstallPlan(fixture, ['*']);
        expect(plan.components.map((component) => component.name)).toEqual([
            'button',
            'popover',
            'command',
            'modal',
            '_internal/overlay'
        ]);
    });
});

describe('suggestComponent', () => {
    const fixture = index([
        component({ name: 'button' }),
        component({ name: '_internal/overlay', visibility: 'internal' })
    ]);

    test('never suggests internal components', () => {
        expect(suggestComponent(fixture, 'overlay')).toBeNull();
    });

    test('suggests close public names', () => {
        expect(suggestComponent(fixture, 'buton')).toBe('button');
    });
});

describe('installableFiles', () => {
    test('excludes manifest.ts', () => {
        const files = installableFiles(
            component({
                files: ['components/button/button.svelte', 'components/button/manifest.ts']
            })
        );
        expect(files).toEqual(['components/button/button.svelte']);
    });
});

describe('rewriteImports', () => {
    test('rewrites subpath and bare imports', () => {
        const source = [
            "import { cn } from '@sivir-ui/svelte/utils';",
            "import { getPopoverContext } from '@sivir-ui/svelte/components/popover/context.svelte.ts';",
            "import Button from '@sivir-ui/svelte';"
        ].join('\n');
        expect(rewriteImports(source, '$lib/sivir')).toBe(
            [
                "import { cn } from '$lib/sivir/utils';",
                "import { getPopoverContext } from '$lib/sivir/components/popover/context.svelte';",
                "import Button from '$lib/sivir';"
            ].join('\n')
        );
    });

    test('leaves unrelated imports alone', () => {
        const source = "import Search from '@lucide/svelte/icons/search';";
        expect(rewriteImports(source, '$lib/sivir')).toBe(source);
    });
});

describe('registry snapshot', () => {
    test('keeps documented Card directly installable', async () => {
        const snapshot = await loadRegistryIndex();
        const card = snapshot.components.find((component) => component.name === 'card');
        expect(card?.visibility).toBe('public');
        expect(resolveInstallPlan(snapshot, ['card']).components[0]?.name).toBe('card');
        expect(snapshot.components.some((component) => component.name === 'panel')).toBe(false);
        expect(snapshot.components.some((component) => component.name === 'marquee')).toBe(false);
        expect(snapshot.components.some((component) => component.name === 'separator')).toBe(false);
    });

    test('installs Scroll Area with Conversation', async () => {
        const snapshot = await loadRegistryIndex();
        const plan = resolveInstallPlan(snapshot, ['conversation']);

        expect(plan.components.map((component) => component.name)).toContain('scroll-area');
    });

    test.each(['card', 'markdown', 'message', 'modal'])(
        'installs Typography with %s',
        async (name) => {
            const snapshot = await loadRegistryIndex();
            const plan = resolveInstallPlan(snapshot, [name]);

            expect(plan.components.map((component) => component.name)).toContain('typography');
        }
    );

    test('index loads and every referenced file exists', async () => {
        const snapshot = await loadRegistryIndex();
        expect(snapshot.components.length).toBeGreaterThan(30);
        for (const entry of snapshot.components) {
            for (const file of [...installableFiles(entry), ...entry.sharedFiles]) {
                expect(existsSync(registryFilePath(file))).toBe(true);
            }
        }
    });

    test('every dependency resolves against the index', async () => {
        const snapshot = await loadRegistryIndex();
        const publicNames = snapshot.components
            .filter((c) => c.visibility === 'public')
            .map((c) => c.name);
        const plan = resolveInstallPlan(snapshot, publicNames);
        expect(plan.components.map((component) => component.name)).toEqual(
            expect.arrayContaining(publicNames)
        );
        expect(plan.components.some((component) => component.name === 'toolbar')).toBe(false);
    });

    test('every isolated install declares its external imports', async () => {
        const snapshot = await loadRegistryIndex();
        const failures: string[] = [];
        const packageName = (specifier: string) =>
            specifier.startsWith('@')
                ? specifier.split('/').slice(0, 2).join('/')
                : specifier.split('/')[0];

        for (const entry of snapshot.components.filter(
            (component) => component.visibility === 'public'
        )) {
            const plan = resolveInstallPlan(snapshot, [entry.name]);
            const declared = new Set([
                ...BASE_PEER_DEPENDENCIES,
                ...Object.keys(plan.peerDependencies)
            ]);
            const imported = new Set<string>();

            for (const componentEntry of plan.components) {
                for (const file of [
                    ...installableFiles(componentEntry),
                    ...componentEntry.sharedFiles
                ]) {
                    const source = readFileSync(registryFilePath(file), 'utf8');
                    const specifiers = [
                        ...source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g),
                        ...source.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
                        ...source.matchAll(/\bimport\s+['"]([^'"]+)['"]/g)
                    ].map((match) => match[1]);

                    for (const specifier of specifiers) {
                        if (
                            specifier.startsWith('.') ||
                            specifier.startsWith('$') ||
                            specifier.startsWith('@sivir-ui/svelte')
                        )
                            continue;
                        imported.add(packageName(specifier));
                    }
                }
            }

            const missing = [...imported].filter((dependency) => !declared.has(dependency)).sort();
            if (missing.length > 0) {
                failures.push(`${entry.name}: ${missing.join(', ')}`);
            }
        }

        if (failures.length > 0) {
            throw new Error(
                `isolated installs are missing external dependencies:\n${failures.join('\n')}`
            );
        }
    });

    test('built-in themes carry rendered css', async () => {
        const themes = await loadRegistryThemes();
        expect(themes.length).toBeGreaterThan(0);
        for (const theme of themes) {
            expect(theme.css).toContain(':root');
            expect(theme.css).toContain('.dark {');
        }
    });
});
