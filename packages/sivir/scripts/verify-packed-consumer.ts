import { spawnSync } from 'node:child_process';
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

async function writeConsumer(cwd: string, tarball: string) {
    const docsPackage = JSON.parse(
        await readFile(path.join(workspaceRoot, 'apps/docs/package.json'), 'utf8')
    ) as {
        devDependencies: Record<string, string>;
    };
    const versions = docsPackage.devDependencies;

    await mkdir(path.join(cwd, 'src/routes'), { recursive: true });
    await writeFile(
        path.join(cwd, 'package.json'),
        `${JSON.stringify(
            {
                name: 'sivir-packed-consumer',
                private: true,
                type: 'module',
                scripts: {
                    check: 'svelte-kit sync && svelte-check --tsconfig ./tsconfig.json',
                    build: 'vite build',
                    optimize: 'vite optimize --force'
                },
                dependencies: {
                    '@sivir-ui/svelte': `file:${tarball}`,
                    svelte: versions.svelte,
                    tailwindcss: versions.tailwindcss
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
    await writeFile(
        path.join(cwd, 'src/routes/+layout.svelte'),
        '<script lang="ts">\n\timport \'@sivir-ui/svelte/ui.css\';\n\tlet { children } = $props();\n</script>\n\n{@render children()}\n'
    );
    await writeFile(
        path.join(cwd, 'src/routes/+page.svelte'),
        `<script lang="ts">
	import { Button, CodeBlock, Input, Modal, Select, Toaster } from '@sivir-ui/svelte';
	let selected = $state('alpha');
</script>

<svelte:head><title>Sivir packed consumer</title></svelte:head>

<main>
	<h1>Verified consumer</h1>
	<Button>Primary action</Button>
	<CodeBlock code="const value = 1;" lang="ts" />
	<Input label="Email" type="email" />
	<Modal.Root>
		<Modal.Trigger>Open dialog</Modal.Trigger>
		<Modal.Content>
			<Modal.Title>Package smoke dialog</Modal.Title>
			<Modal.Description>Installed from the packed tarball.</Modal.Description>
		</Modal.Content>
	</Modal.Root>
	<Select.Root bind:value={selected}>
		<Select.Trigger>Choose an option</Select.Trigger>
		<Select.Content>
			<Select.Item value="alpha">Alpha</Select.Item>
			<Select.Item value="beta">Beta</Select.Item>
		</Select.Content>
	</Select.Root>
	<Toaster />
</main>
`
    );
}

run('bun', ['run', 'build'], packageRoot);
await rm(releaseDir, { recursive: true, force: true });
await mkdir(releaseDir, { recursive: true });

run('npm', ['pack', '--silent', '--ignore-scripts', '--pack-destination', releaseDir], packageRoot);
const artifacts = (await readdir(releaseDir)).filter((file) => file.endsWith('.tgz'));
if (artifacts.length !== 1) {
    throw new Error(`npm pack emitted ${artifacts.length} tarballs instead of one`);
}
const tarball = path.join(releaseDir, artifacts[0]);
const paths = run('tar', ['-tzf', tarball], packageRoot)
    .trim()
    .split('\n')
    .map((file) => file.replace(/^package\//, ''))
    .filter(Boolean);
const required = [
    'LICENSE',
    'README.md',
    'package.json',
    'dist/index.js',
    'registry/index.json',
    'registry/themes.json',
    'dist/svelte/index.js',
    'dist/svelte/index.d.ts',
    'dist/svelte/ui.css'
];
for (const file of required) {
    if (!paths.includes(file)) throw new Error(`packed artifact is missing ${file}`);
}
if (!paths.some((file) => file.startsWith('registry/files/'))) {
    throw new Error('packed artifact has no installable registry files');
}
for (const file of paths) {
    if (!/^(?:LICENSE|README\.md|package\.json|dist\/|registry\/)/.test(file)) {
        throw new Error(`packed artifact contains unexpected file: ${file}`);
    }
    if (/(?:^|\/)\.env(?:\.|$)/.test(file)) {
        throw new Error(`packed artifact contains environment data: ${file}`);
    }
}

const consumer = await mkdtemp(path.join(tmpdir(), 'sivir-packed-consumer-'));
try {
    await writeConsumer(consumer, tarball);
    run('bun', ['install', '--ignore-scripts'], consumer);
    run('bun', ['run', 'check'], consumer);
    run('bun', ['run', 'optimize'], consumer);
    run('bun', ['run', 'build'], consumer);
} finally {
    await rm(consumer, { recursive: true, force: true });
}

console.log(
    `verified ${path.relative(packageRoot, tarball)} (${paths.length} files) in a fresh SvelteKit consumer`
);
