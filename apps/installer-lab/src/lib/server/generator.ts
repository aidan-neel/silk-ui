import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { InstallPath } from '$lib/run-types';

export type RegistryComponent = {
    name: string;
    version: string;
    visibility: 'public' | 'internal';
    description?: string;
};

export type RegistryIndex = {
    cliVersion: string;
    builtAt: string;
    components: RegistryComponent[];
};

export type GeneratedExample = {
    name: string;
    description: string;
    fixture: string;
    route: string;
    toaster: boolean;
};

function titleCase(value: string) {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function htmlEscape(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

async function selectFixture(componentDirectory: string) {
    const examplesDirectory = path.join(componentDirectory, 'examples');
    const hero = path.join(examplesDirectory, 'hero.svelte');
    if (existsSync(hero)) return hero;

    const page = path.join(componentDirectory, '+page.svelte');
    if (existsSync(page)) {
        const pageSource = await readFile(page, 'utf8');
        const match = pageSource.match(/from\s+['"]\.\/examples\/([^'"]+\.svelte)['"]/);
        if (match) {
            const documented = path.join(examplesDirectory, match[1]);
            if (existsSync(documented)) return documented;
        }
    }

    if (existsSync(examplesDirectory)) {
        const first = (await readdir(examplesDirectory))
            .filter((entry) => entry.endsWith('.svelte'))
            .sort()[0];
        if (first) return path.join(examplesDirectory, first);
    }

    throw new Error(`No usable example fixture found under ${examplesDirectory}`);
}

async function copyFixtureAssets(sourceDirectory: string, targetDirectory: string) {
    for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
        if (entry.name.endsWith('.svelte')) continue;
        const source = path.join(sourceDirectory, entry.name);
        const target = path.join(targetDirectory, entry.name);
        if (entry.isDirectory()) {
            await mkdir(target, { recursive: true });
            await copyFixtureAssets(source, target);
        } else if (entry.isFile()) {
            await mkdir(path.dirname(target), { recursive: true });
            await copyFile(source, target);
        }
    }
}

export function rewriteFixtureImports(source: string, installPath: InstallPath) {
    if (installPath === 'package') return source;
    return source.replaceAll('@sivir-ui/svelte/components/', '$lib/sivir/components/');
}

export function rootCss(installPath: InstallPath) {
    const uiImport = installPath === 'cli' ? '$lib/sivir/ui.css' : '@sivir-ui/svelte/ui.css';
    const source = installPath === 'cli' ? '@source "../lib/sivir/**/*.{svelte,ts}";' : '';
    return `@import '@fontsource/inter/latin-400.css';
@import '@fontsource/inter/latin-500.css';
@import '@fontsource/inter/latin-600.css';
@import '@fontsource/inter/latin-700.css';
@import 'tailwindcss';
@import '${uiImport}';
${source}

:root {
	font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	color: var(--color-foreground);
	background: var(--color-background);
	font-synthesis-weight: none;
}

html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body { margin: 0; min-width: 320px; min-height: 100vh; }
@layer base { button, input { font: inherit; } }
* { box-sizing: border-box; }

body { font-size: var(--font-size-body); font-weight: var(--font-weight-body); line-height: 1.5; }

.showcase-shell { min-height: 100vh; background: var(--color-background); color: var(--color-foreground); }
.showcase-nav { position: sticky; top: 0; z-index: 20; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: color-mix(in srgb, var(--color-background) 88%, transparent); border-bottom: 1px solid var(--color-border); backdrop-filter: blur(18px); }
.showcase-brand { display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; font-size: 14px; font-weight: 650; letter-spacing: -0.015em; }
.showcase-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 9px; color: white; background: var(--color-primary); box-shadow: 0 0 0 1px rgb(0 0 0 / 8%), 0 2px 5px rgb(0 0 0 / 12%); }
.showcase-meta { color: var(--color-foreground-muted); font-size: 12px; }
.showcase-grid { display: grid; grid-template-columns: 244px minmax(0, 1fr); min-height: calc(100vh - 60px); }
.showcase-sidebar { position: sticky; top: 60px; align-self: start; height: calc(100vh - 60px); padding: 18px 14px; border-right: 1px solid var(--color-border); overflow: auto; }
.showcase-search { width: 100%; height: 40px; padding: 0 12px; border: 1px solid var(--color-border); border-radius: 10px; color: var(--color-foreground); background: var(--color-background); outline: none; transition-property: border-color, box-shadow; transition-duration: 150ms; }
.showcase-search:focus-visible { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent); }
.showcase-links { display: grid; gap: 2px; margin-top: 12px; }
.showcase-link { min-height: 40px; display: flex; align-items: center; padding: 0 10px; border-radius: 9px; color: var(--color-foreground-muted); text-decoration: none; font-size: 13px; transition-property: color, background-color; transition-duration: 150ms; }
.showcase-link:hover { color: var(--color-foreground); background: var(--color-secondary); }
.showcase-link[aria-current='page'] { color: var(--color-foreground); background: var(--color-secondary); font-weight: 600; }
.showcase-main { min-width: 0; padding: 40px clamp(24px, 6vw, 72px) 80px; }
.component-page { width: min(760px, 100%); margin: 0 auto; }
.component-eyebrow { margin: 0 0 8px; color: var(--color-primary); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.component-title { margin: 0; color: var(--color-foreground); font-family: var(--font-header); font-size: 30px; font-weight: var(--font-weight-header); line-height: 1.2; letter-spacing: -.02em; text-wrap: balance; }
.component-description { max-width: 620px; margin: 8px 0 0; color: var(--color-foreground-muted); font-size: 16px; font-weight: var(--font-weight-description); line-height: 1.5; text-wrap: pretty; }
.demo-frame { min-height: 320px; display: grid; place-items: center; margin-top: 40px; padding: 40px; border-radius: 14px; background: var(--color-panel); box-shadow: 0 0 0 1px rgb(0 0 0 / 8%), 0 1px 2px -1px rgb(0 0 0 / 6%); overflow: visible; }
.empty-search { padding: 10px; color: var(--color-foreground-muted); font-size: 13px; }
@media (max-width: 760px) { .showcase-grid { grid-template-columns: 1fr; } .showcase-sidebar { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--color-border); } .showcase-links { grid-template-columns: repeat(2, minmax(0, 1fr)); max-height: 180px; overflow: auto; } .showcase-main { padding-top: 40px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
`;
}

function shellSource() {
    return `<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { catalog } from '$lib/catalog';
	const { children }: { children: Snippet } = $props();
	let query = $state('');
	const filtered = $derived(catalog.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())));
</script>

<div class="showcase-shell">
	<nav class="showcase-nav" aria-label="Primary">
		<a class="showcase-brand" href="/components/{catalog[0].name}"><span class="showcase-mark" aria-hidden="true">S</span><span>Sivir installation preview</span></a>
		<span class="showcase-meta">{catalog.length} components</span>
	</nav>
	<div class="showcase-grid">
		<aside class="showcase-sidebar">
			<label><span class="sr-only">Search components</span><input class="showcase-search" type="search" placeholder="Search components…" bind:value={query} /></label>
			<nav class="showcase-links" aria-label="Components">
				{#each filtered as item (item.name)}<a class="showcase-link" href={'/components/' + item.name} aria-current={$page.url.pathname === '/components/' + item.name ? 'page' : undefined}>{item.title}</a>{/each}
				{#if filtered.length === 0}<span class="empty-search">No components found.</span>{/if}
			</nav>
		</aside>
		<main class="showcase-main">{@render children()}</main>
	</div>
</div>
`;
}

function routeSource(component: RegistryComponent, toaster: boolean, importPrefix: string) {
    const title = titleCase(component.name);
    const description = component.description ?? `Installed ${title} component example.`;
    const toasterImport = toaster ? `\n\timport { Toaster } from '${importPrefix}/toast';` : '';
    const toasterMarkup = toaster ? '\n<Toaster />' : '';
    return `<script lang="ts">
	import Example from '$lib/showcase/${component.name}/Example.svelte';${toasterImport}
</script>

<svelte:head><title>${htmlEscape(title)} · Sivir installer preview</title><meta name="description" content={${JSON.stringify(description)}} /></svelte:head>

<article class="component-page">
	<header>
		<p class="component-eyebrow">Installed component</p>
		<h1 class="component-title">${htmlEscape(title)}</h1>
		<p class="component-description">${htmlEscape(description)}</p>
	</header>
	<section class="demo-frame" aria-label="${htmlEscape(title)} example"><Example /></section>
</article>${toasterMarkup}
`;
}

export async function generateShowcase(options: {
    consumerRoot: string;
    docsComponentsRoot: string;
    registry: RegistryIndex;
    installPath: InstallPath;
}) {
    const { consumerRoot, docsComponentsRoot, registry, installPath } = options;
    const publicComponents = registry.components
        .filter((component) => component.visibility === 'public')
        .sort((a, b) => a.name.localeCompare(b.name));
    if (publicComponents.length === 0)
        throw new Error('The staged registry has no public components');

    const tsconfigPath = path.join(consumerRoot, 'tsconfig.json');
    if (existsSync(tsconfigPath)) {
        const tsconfig = await readFile(tsconfigPath, 'utf8');
        if (!tsconfig.includes('"allowImportingTsExtensions"')) {
            await writeFile(
                tsconfigPath,
                tsconfig.replace(
                    '"compilerOptions": {',
                    '"compilerOptions": {\n\t\t"allowImportingTsExtensions": true,'
                )
            );
        }
    }

    const generated: GeneratedExample[] = [];
    for (const component of publicComponents) {
        const componentDirectory = path.join(docsComponentsRoot, component.name);
        if (!existsSync(componentDirectory)) {
            throw new Error(`Public component "${component.name}" has no docs fixture directory`);
        }
        const fixture = await selectFixture(componentDirectory);
        const fixtureSource = await readFile(fixture, 'utf8');
        const rewritten = rewriteFixtureImports(fixtureSource, installPath);
        const toaster = /import\s*\{[^}]*\btoast\b[^}]*\}\s*from/.test(fixtureSource);
        const exampleDirectory = path.join(consumerRoot, 'src', 'lib', 'showcase', component.name);
        await mkdir(exampleDirectory, { recursive: true });
        await writeFile(path.join(exampleDirectory, 'Example.svelte'), rewritten);
        await copyFixtureAssets(path.dirname(fixture), exampleDirectory);

        const routeDirectory = path.join(
            consumerRoot,
            'src',
            'routes',
            'components',
            component.name
        );
        await mkdir(routeDirectory, { recursive: true });
        const importPrefix =
            installPath === 'cli' ? '$lib/sivir/components' : '@sivir-ui/svelte/components';
        await writeFile(
            path.join(routeDirectory, '+page.svelte'),
            routeSource(component, toaster, importPrefix)
        );
        generated.push({
            name: component.name,
            description: component.description ?? '',
            fixture,
            route: `/components/${component.name}`,
            toaster
        });
    }

    const catalog = publicComponents.map((component) => ({
        name: component.name,
        title: titleCase(component.name),
        description: component.description ?? ''
    }));
    await mkdir(path.join(consumerRoot, 'src', 'lib'), { recursive: true });
    await writeFile(
        path.join(consumerRoot, 'src', 'lib', 'catalog.ts'),
        `export const catalog = ${JSON.stringify(catalog, null, '\t')} as const;\n`
    );
    await writeFile(path.join(consumerRoot, 'src', 'lib', 'ShowcaseShell.svelte'), shellSource());
    await writeFile(path.join(consumerRoot, 'src', 'routes', 'layout.css'), rootCss(installPath));
    await writeFile(
        path.join(consumerRoot, 'src', 'routes', '+layout.svelte'),
        `<script lang="ts">\n\timport '../routes/layout.css';\n\timport ShowcaseShell from '$lib/ShowcaseShell.svelte';\n\timport type { Snippet } from 'svelte';\n\tconst { children }: { children: Snippet } = $props();\n</script>\n\n<ShowcaseShell>{@render children()}</ShowcaseShell>\n`
    );
    await writeFile(
        path.join(consumerRoot, 'src', 'routes', '+page.ts'),
        `import { redirect } from '@sveltejs/kit';\nexport const load = () => redirect(307, '/components/${publicComponents[0].name}');\n`
    );

    return generated;
}
