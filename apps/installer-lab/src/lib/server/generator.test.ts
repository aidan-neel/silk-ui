import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { generateShowcase, type RegistryIndex, rootCss } from './generator';

const roots: string[] = [];
afterEach(async () =>
    Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
);

async function fixtureRoot() {
    const root = await mkdtemp(path.join(os.tmpdir(), 'installer-generator-'));
    roots.push(root);
    const docs = path.join(root, 'docs');
    const consumer = path.join(root, 'consumer');
    await mkdir(path.join(consumer, 'src', 'routes'), { recursive: true });
    return { root, docs, consumer };
}

const registry: RegistryIndex = {
    cliVersion: '1.2.3',
    builtAt: '2026-01-01T00:00:00.000Z',
    components: [
        { name: 'button', version: '1', visibility: 'public', description: 'Pressable action.' },
        { name: 'toast', version: '1', visibility: 'public', description: 'Transient notice.' },
        { name: '_overlay', version: '1', visibility: 'internal' }
    ]
};

async function writeDocsFixtures(docs: string) {
    await mkdir(path.join(docs, 'button', 'examples', 'snippets'), { recursive: true });
    await writeFile(
        path.join(docs, 'button', 'examples', 'hero.svelte'),
        `<script lang="ts">\nimport { Button } from '@sivir-ui/svelte/components/button';\nimport snippet from './snippets/example.txt?raw';\n</script>\n<Button>{snippet}</Button>\n`
    );
    await writeFile(path.join(docs, 'button', 'examples', 'snippets', 'example.txt'), 'hello');
    await mkdir(path.join(docs, 'toast', 'examples'), { recursive: true });
    await writeFile(
        path.join(docs, 'toast', '+page.svelte'),
        `<script>import First from './examples/first.svelte';</script>`
    );
    await writeFile(
        path.join(docs, 'toast', 'examples', 'first.svelte'),
        `<script>import { toast } from '@sivir-ui/svelte/components/toast';</script><button onclick={() => toast.success('ok')}>Toast</button>`
    );
}

describe('showcase generation', () => {
    test.each(['cli', 'package'] as const)(
        'keeps the component typography cascade intact in %s mode',
        (installPath) => {
            const css = rootCss(installPath);
            expect(css).toContain("@import '@fontsource/inter/latin-400.css';");
            expect(css).toContain("@import '@fontsource/inter/latin-700.css';");
            expect(css).toContain('@layer base { button, input { font: inherit; } }');
            expect(css).toContain(
                'body { font-size: var(--font-size-body); font-weight: var(--font-weight-body); line-height: 1.5; }'
            );
            expect(css).toContain('font-size: 30px');
            expect(css).toContain('min-height: 320px');
            expect(css).not.toMatch(/^button, input \{ font: inherit; \}$/m);
        }
    );

    test.each(['cli', 'package'] as const)(
        'creates every public route in %s mode',
        async (installPath) => {
            const { docs, consumer } = await fixtureRoot();
            await writeDocsFixtures(docs);
            const generated = await generateShowcase({
                consumerRoot: consumer,
                docsComponentsRoot: docs,
                registry,
                installPath
            });
            expect(generated.map((item) => item.name)).toEqual(['button', 'toast']);
            expect(generated.find((item) => item.name === 'toast')?.toaster).toBe(true);
            expect(
                await readFile(
                    path.join(consumer, 'src/lib/showcase/button/snippets/example.txt'),
                    'utf8'
                )
            ).toBe('hello');

            const example = await readFile(
                path.join(consumer, 'src/lib/showcase/button/Example.svelte'),
                'utf8'
            );
            const expectedPrefix = installPath === 'cli' ? '$lib/sivir' : '@sivir-ui/svelte';
            expect(example).toContain(`${expectedPrefix}/components/button`);
            const toastPage = await readFile(
                path.join(consumer, 'src/routes/components/toast/+page.svelte'),
                'utf8'
            );
            expect(toastPage).toContain('Toaster');
            const buttonPage = await readFile(
                path.join(consumer, 'src/routes/components/button/+page.svelte'),
                'utf8'
            );
            expect(buttonPage).not.toContain('Toaster');
        }
    );

    test('fails clearly when a public component has no usable docs fixture', async () => {
        const { docs, consumer } = await fixtureRoot();
        await mkdir(path.join(docs, 'button'), { recursive: true });
        await expect(
            generateShowcase({
                consumerRoot: consumer,
                docsComponentsRoot: docs,
                registry: { ...registry, components: [registry.components[0]] },
                installPath: 'cli'
            })
        ).rejects.toThrow('No usable example fixture');
    });
});
