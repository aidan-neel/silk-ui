import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { changelogDocsMarkdown, changelogMarkdown, changelogVersions } from '$lib/changelog';
import { components } from '$lib/components';
import { brandMarkMarkdown, componentMarkdown, componentsMarkdown } from '$lib/llms';
import { GET as getChangelog } from '../../../src/routes/changelog/[version]/+server';
import { GET as getLlms } from '../../../src/routes/llms.txt/+server';
import { GET as getRobots } from '../../../src/routes/robots.txt/+server';
import { GET as getSitemap } from '../../../src/routes/sitemap.xml/+server';

const root = resolve(process.cwd(), '../..');
const removedComponents = ['approval-request', 'marquee', 'panel', 'separator'];

function directoryNames(path: string): string[] {
    return readdirSync(path, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right));
}

describe('docs release contracts', () => {
    it('keeps package components, explicit routes, and navigation in sync', () => {
        const packageComponents = directoryNames(resolve(root, 'packages/sivir/src/components'));
        const routeComponents = directoryNames(
            resolve(root, 'apps/docs/src/routes/docs/components')
        ).filter((name) => !name.startsWith('['));

        expect(components).toEqual(packageComponents);
        expect(routeComponents).toEqual(packageComponents);
    });

    it('uses the live component count in homepage copy', () => {
        const homepage = readFileSync(resolve(root, 'apps/docs/src/routes/+page.svelte'), 'utf8');
        const readme = readFileSync(resolve(root, 'README.md'), 'utf8');
        expect(homepage.match(new RegExp(`${components.length} Svelte`, 'g'))).toHaveLength(2);
        expect(homepage).toContain(`Browse all ${components.length} components`);
        expect(readme).toContain(`badge/Components-${components.length}-`);
    });

    it('serves an origin-aware robots file', async () => {
        const response = (await getRobots({
            url: new URL('https://preview.example/robots.txt')
        } as Parameters<typeof getRobots>[0])) as Response;

        expect(response.headers.get('content-type')).toContain('text/plain');
        expect(await response.text()).toContain('Sitemap: https://preview.example/sitemap.xml');
    });

    it('lists every public component in the origin-aware sitemap', async () => {
        const response = (await getSitemap({
            url: new URL('https://preview.example/sitemap.xml')
        } as Parameters<typeof getSitemap>[0])) as Response;
        const body = await response.text();

        expect(response.headers.get('content-type')).toContain('application/xml');
        for (const component of components) {
            expect(body).toContain(
                `<loc>https://preview.example/docs/components/${component}</loc>`
            );
        }
        expect(body).toContain('<loc>https://preview.example/docs/components</loc>');
        // home + intro + install + theming + changelog + components index + Theme Studio.
        expect(body.match(/<url>/g)).toHaveLength(components.length + 7 + changelogVersions.length);
        expect(body).toContain('<loc>https://preview.example/docs/changelog</loc>');
        expect(body).toContain('<loc>https://preview.example/studio</loc>');
        for (const version of changelogVersions) {
            expect(body).toContain(`<loc>https://preview.example/changelog/${version}</loc>`);
        }
        expect(body).not.toContain('/themes</loc>');
        expect(body).not.toContain('/themes/studio');
        expect(body).not.toContain('/docs/styling');
    });

    it('provides complete Markdown references for agents', async () => {
        const response = (await getLlms({
            url: new URL('https://preview.example/llms.txt')
        } as Parameters<typeof getLlms>[0])) as Response;
        const index = await response.text();

        expect(response.headers.get('content-type')).toContain('text/markdown');
        expect(index).toContain('https://preview.example/docs/introduction.md');
        expect(index).toContain('https://preview.example/docs/brand-mark.md');
        expect(index).toContain(`The current catalog contains ${components.length} components`);
        for (const version of changelogVersions) {
            expect(index).toContain(`https://preview.example/changelog/${version}`);
        }
        for (const component of components) {
            expect(index).toContain(`https://preview.example/docs/components/${component}.md`);
            const reference = componentMarkdown(component);
            expect(reference).toMatch(/^# .+/);
            expect(reference).toContain('## API');
            expect(reference).toContain('## Install');
        }
        for (const removed of removedComponents) {
            expect(index).not.toContain(`/docs/components/${removed}.md`);
        }
    });

    it('documents package-only and removed component contracts accurately', () => {
        const brandMark = brandMarkMarkdown();
        const toolbar = componentMarkdown('toolbar');
        const componentIndex = componentsMarkdown();

        expect(brandMark).toContain("import { BrandMark } from '@sivir-ui/svelte'");
        expect(brandMark).toContain('`label?: string`');
        expect(toolbar).toContain('not a standalone CLI registry target');
        expect(toolbar).toContain('bun add @sivir-ui/svelte');
        expect(toolbar).not.toContain('sivir add toolbar');
        expect(componentIndex).toContain('**Approval Request:**');
        expect(componentIndex).toContain('Compose `AlertDialog` directly');
        expect(componentIndex).toContain('Card.Root variant="panel"');
        expect(componentIndex).toContain('**Marquee:**');
        expect(componentIndex).toContain('**Separator:**');

        for (const removed of removedComponents) {
            expect(componentMarkdown(removed)).toBeUndefined();
            expect(componentIndex).not.toContain(`/docs/components/${removed}.md`);
        }
    });

    it('uses CLI installation only for registry-public components', () => {
        for (const component of components) {
            const reference = componentMarkdown(component);
            if (component === 'toolbar') {
                expect(reference).not.toContain(`sivir add ${component}`);
                continue;
            }
            expect(reference).toContain(`sivir add ${component}`);
        }
    });

    it('serves every release as compiled Markdown for integrations', async () => {
        expect(changelogVersions).toContain('0.2.1');
        expect(changelogVersions).toContain('0.2.6');
        expect(changelogMarkdown('missing')).toBeUndefined();

        const response = (await getChangelog({
            params: { version: '0.2.1' }
        } as Parameters<typeof getChangelog>[0])) as Response;

        expect(response.headers.get('content-type')).toContain('text/markdown');
        expect(await response.text()).toContain('# @sivir-ui/svelte 0.2.1 changelog');
        expect(changelogMarkdown('0.2.1')).toContain('## Feature');
        expect(changelogMarkdown('0.2.1')).toContain('versioned Markdown changelog');
        expect(changelogMarkdown('0.2.6')).toContain('inset frame');
        expect(changelogDocsMarkdown()).toContain('## 0.2.6');
    });

    it('derives LLM references from current component manifests, APIs, and examples', () => {
        const buttonReference = componentMarkdown('button');
        const toolReference = componentMarkdown('tool');
        const reasoningReference = componentMarkdown('reasoning');

        expect(buttonReference).toContain('Quiet matches ghost text color without a hover fill.');
        expect(toolReference).toContain('variant="quiet"');
        expect(toolReference).toContain('### Quiet');
        expect(reasoningReference).toContain('Button quiet variant');
        expect(buttonReference).toContain('Changes to those source files are reflected here');
    });

    it('keeps getting-started docs free of Theme Studio and wrong CLI invocations', () => {
        const pages = [
            'apps/docs/src/routes/docs/introduction/+page.svelte',
            'apps/docs/src/routes/docs/installation/+page.svelte',
            'apps/docs/src/routes/docs/theming/+page.svelte'
        ];
        for (const page of pages) {
            const source = readFileSync(resolve(root, page), 'utf8');
            expect(source, page).not.toMatch(/Theme Studio|theme studio|\/themes\/studio/i);
            expect(source, page).not.toContain('bunx @sivir-ui/svelte init');
            expect(source, page).not.toContain('bunx @sivir-ui/svelte add');
            expect(source, page).not.toContain('/docs/styling');
        }
        const install = readFileSync(
            resolve(root, 'apps/docs/src/routes/docs/installation/+page.svelte'),
            'utf8'
        );
        expect(install).toContain('bunx --package @sivir-ui/svelte sivir init');
        expect(install).toContain('bun add @sivir-ui/svelte');
        const stylingRedirect = readFileSync(
            resolve(root, 'apps/docs/src/routes/docs/styling/+page.ts'),
            'utf8'
        );
        expect(stylingRedirect).toContain("redirect(301, '/docs/theming')");
    });

    it('keeps Docker/docs deployment contracts intact (registry optional for v1)', () => {
        const compose = readFileSync(resolve(root, 'docker-compose.yml'), 'utf8');
        const dockerfile = readFileSync(resolve(root, 'apps/docs/Dockerfile'), 'utf8');
        const registryDockerfile = readFileSync(resolve(root, 'apps/registry/Dockerfile'), 'utf8');
        const config = readFileSync(resolve(root, 'apps/docs/svelte.config.js'), 'utf8');
        const viteConfig = readFileSync(resolve(root, 'apps/docs/vite.config.ts'), 'utf8');

        // Compose still wires registry for local full-stack dev; v1 public docs do not require it.
        expect(compose).toContain("THEME_REGISTRY_URL: 'http://registry:4100'");
        expect(dockerfile).toContain('FROM oven/bun:1.3.11');
        expect(dockerfile).toContain('ENV DOCS_ADAPTER=node');
        expect(dockerfile).toContain('ENV LEFTHOOK=0');
        expect(dockerfile).toContain('bun install --frozen-lockfile --ignore-scripts');
        expect(dockerfile).toContain('COPY apps/installer-lab/package.json');
        expect(dockerfile).not.toContain('/repo/node_modules ./node_modules');
        expect(config).toContain("process.env.DOCS_ADAPTER === 'node'");
        expect(viteConfig).toContain(
            "noExternal: ['@floating-ui/dom', 'clsx', 'tailwind-variants']"
        );
        expect(registryDockerfile).toContain('COPY packages/sivir ./packages/sivir');
        expect(registryDockerfile).toContain('FROM oven/bun:1.3.11');
        expect(registryDockerfile).toContain('ENV LEFTHOOK=0');
        expect(registryDockerfile).toContain('bun install --frozen-lockfile --ignore-scripts');
        expect(registryDockerfile).toContain("--filter='registry' --filter='@sivir-ui/svelte'");
        expect(registryDockerfile).toContain('COPY --from=build');
        expect(registryDockerfile).toContain('COPY apps/installer-lab/package.json');
    });
});
