/**
 * Phase 2 §4 — verify the CLI source-copy path against the retained npm tarball.
 *
 * Consumes exactly one packages/sivir/.release/*.tgz produced by verify:artifact.
 * Does not rebuild, repack, or invoke the working-tree CLI.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(packageRoot, '../..');
const releaseDir = path.join(packageRoot, '.release');

function run(command: string, args: string[], cwd: string) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: 'utf8',
        env: {
            ...process.env,
            LEFTHOOK: '0',
            CI: '1',
            TMPDIR: process.env.TMPDIR ?? tmpdir(),
            BUN_INSTALL_CACHE_DIR:
                process.env.BUN_INSTALL_CACHE_DIR ?? path.join(tmpdir(), 'sivir-bun-cache'),
            npm_config_cache: process.env.npm_config_cache ?? path.join(tmpdir(), 'sivir-npm-cache')
        }
    });
    if (result.status !== 0) {
        throw new Error(
            [`$ ${command} ${args.join(' ')}`, result.error?.message, result.stdout, result.stderr]
                .filter(Boolean)
                .join('\n')
        );
    }
    return result.stdout;
}

async function writeCliConsumer(cwd: string, tarball: string) {
    const docsPackage = JSON.parse(
        await readFile(path.join(workspaceRoot, 'apps/docs/package.json'), 'utf8')
    ) as {
        devDependencies: Record<string, string>;
    };
    const versions = docsPackage.devDependencies;

    await mkdir(path.join(cwd, 'src/routes'), { recursive: true });
    await mkdir(path.join(cwd, 'src/lib'), { recursive: true });

    await writeFile(
        path.join(cwd, 'package.json'),
        `${JSON.stringify(
            {
                name: 'sivir-cli-artifact-consumer',
                private: true,
                type: 'module',
                scripts: {
                    check: 'svelte-kit sync && svelte-check --tsconfig ./tsconfig.json',
                    build: 'vite build'
                },
                dependencies: {
                    '@sivir-ui/svelte': `file:${tarball}`,
                    svelte: versions.svelte,
                    tailwindcss: versions.tailwindcss,
                    '@floating-ui/dom': '^1.7.6',
                    '@lucide/svelte': '^1.7.0',
                    cnfast: '^0.0.8',
                    'fuse.js': '^7.1.0',
                    'highlight.js': '^11.11.1',
                    'tailwind-merge': '^3.6.0',
                    'tailwind-variants': '^3.2.2'
                },
                devDependencies: {
                    '@sveltejs/kit': versions['@sveltejs/kit'],
                    '@sveltejs/vite-plugin-svelte': versions['@sveltejs/vite-plugin-svelte'],
                    '@tailwindcss/vite': versions['@tailwindcss/vite'],
                    '@types/node': versions['@types/node'],
                    'svelte-check': versions['svelte-check'],
                    typescript: versions.typescript,
                    vite: versions.vite
                }
            },
            null,
            '\t'
        )}\n`
    );

    await writeFile(
        path.join(cwd, 'svelte.config.js'),
        "import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';\n\nexport default { preprocess: vitePreprocess() };\n"
    );
    await writeFile(
        path.join(cwd, 'vite.config.ts'),
        "import tailwindcss from '@tailwindcss/vite';\nimport { sveltekit } from '@sveltejs/kit/vite';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({ plugins: [sveltekit(), tailwindcss()] });\n"
    );
    await writeFile(
        path.join(cwd, 'tsconfig.json'),
        `${JSON.stringify(
            {
                extends: './.svelte-kit/tsconfig.json',
                compilerOptions: {
                    allowJs: true,
                    checkJs: true,
                    esModuleInterop: true,
                    forceConsistentCasingInFileNames: true,
                    resolveJsonModule: true,
                    skipLibCheck: true,
                    sourceMap: true,
                    strict: true,
                    moduleResolution: 'bundler'
                }
            },
            null,
            '\t'
        )}\n`
    );
    await writeFile(
        path.join(cwd, 'src/app.html'),
        '<!doctype html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="utf-8" />\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1" />\n\t\t%sveltekit.head%\n\t</head>\n\t<body>\n\t\t<div style="display: contents">%sveltekit.body%</div>\n\t</body>\n</html>\n'
    );
    await writeFile(path.join(cwd, 'src/app.css'), "@import './lib/sivir/ui.css';\n");
    await writeFile(
        path.join(cwd, 'src/routes/+layout.svelte'),
        '<script lang="ts">\n\timport \'../app.css\';\n\tlet { children } = $props();\n</script>\n\n{@render children()}\n'
    );
    await writeFile(
        path.join(cwd, 'src/routes/+page.svelte'),
        `<script lang="ts">
	import { Button } from '$lib/sivir/components/button';
	import * as Modal from '$lib/sivir/components/modal';
</script>

<main>
	<h1>CLI artifact consumer</h1>
	<Button>Primary</Button>
	<Modal.Root>
		<Modal.Trigger>Open</Modal.Trigger>
		<Modal.Content>
			<Modal.Title>From CLI source copy</Modal.Title>
			<Modal.Description>Installed via the packed sivir binary.</Modal.Description>
		</Modal.Content>
	</Modal.Root>
</main>
`
    );
}

function sivirBin(cwd: string) {
    const candidates = [
        path.join(cwd, 'node_modules', '.bin', 'sivir'),
        path.join(cwd, 'node_modules', '@sivir', 'ui', 'dist', 'index.js')
    ];
    for (const candidate of candidates) {
        if (existsSync(candidate)) return candidate;
    }
    throw new Error('packed consumer did not install the sivir binary');
}

function runSivir(cwd: string, args: string[]) {
    const bin = sivirBin(cwd);
    if (bin.endsWith('.js')) {
        return run(process.execPath, [bin, ...args], cwd);
    }
    return run(bin, args, cwd);
}

if (!existsSync(releaseDir)) {
    throw new Error(
        `${path.relative(workspaceRoot, releaseDir)} is missing — run verify:artifact first`
    );
}

const artifacts = (await readdir(releaseDir)).filter((file) => file.endsWith('.tgz'));
if (artifacts.length !== 1) {
    throw new Error(
        `expected exactly one retained tarball in .release/, found ${artifacts.length}. Run verify:artifact first and do not repack.`
    );
}
const tarball = path.join(releaseDir, artifacts[0]);

const consumer = await mkdtemp(path.join(tmpdir(), 'sivir-cli-artifact-'));
try {
    await writeCliConsumer(consumer, tarball);
    run('bun', ['install', '--ignore-scripts'], consumer);

    // Must use the installed package binary, never packages/sivir/dist from the monorepo.
    const bin = sivirBin(consumer);
    if (bin.includes(packageRoot) || bin.includes(path.join('packages', 'sivir', 'dist'))) {
        throw new Error(`CLI binary resolved to the working tree, not the tarball: ${bin}`);
    }

    runSivir(consumer, ['init', '--yes']);
    runSivir(consumer, ['list']);
    runSivir(consumer, ['add', 'button', '--yes']);
    runSivir(consumer, ['add', 'modal', '--yes']);
    runSivir(consumer, ['add', 'theme', 'default']);

    const config = JSON.parse(await readFile(path.join(consumer, 'sivir.json'), 'utf8')) as {
        registry?: string;
    };
    if (config.registry !== 'https://registry.sivir.dev') {
        throw new Error(
            `expected sivir.json registry https://registry.sivir.dev, got ${config.registry}`
        );
    }

    const requiredFiles = [
        'src/lib/sivir/ui.css',
        'src/lib/sivir/utils.ts',
        'src/lib/sivir/components/button/button.svelte',
        'src/lib/sivir/components/modal/modal.svelte',
        'src/lib/sivir/theme.css'
    ];
    for (const file of requiredFiles) {
        if (!existsSync(path.join(consumer, file))) {
            throw new Error(`CLI source-copy missing ${file}`);
        }
    }

    // Idempotent re-add should not fail.
    runSivir(consumer, ['add', 'button', '--yes']);

    run('bun', ['run', 'check'], consumer);
    run('bun', ['run', 'build'], consumer);
} finally {
    await rm(consumer, { recursive: true, force: true });
}

console.log(
    `verified CLI source-copy against retained ${path.relative(packageRoot, tarball)} (no working-tree CLI)`
);
