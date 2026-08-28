import { changelogVersions } from '$lib/changelog';
import { components, sanitizeComponent } from '$lib/components';

type ComponentManifest = {
    name: string;
    version: string;
    visibility: 'public' | 'internal';
    description: string;
    components: string[];
    shared: string[];
};

const removedComponents = [
    {
        name: 'Approval Request',
        guidance:
            'Compose `AlertDialog` directly with the review details and confirmation actions required by your workflow.'
    },
    {
        name: 'Marquee',
        guidance:
            'Use a restrained Tailwind animation around the content only when continuous motion is essential.'
    },
    {
        name: 'Panel',
        guidance: 'Use `Card.Root variant="panel"` for the former framed panel treatment.'
    },
    {
        name: 'Separator',
        guidance:
            'Use a semantic `<hr>` or a Tailwind border utility. Compound component separator parts remain available where documented.'
    }
] as const;

const manifests = import.meta.glob<{ manifest: ComponentManifest }>(
    '../../../../packages/sivir/src/components/*/manifest.ts',
    { eager: true }
);
const indexes = import.meta.glob<string>('../../../../packages/sivir/src/components/*/index.ts', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const examples = import.meta.glob<string>('../routes/docs/components/*/examples/*.svelte', {
    eager: true,
    query: '?raw',
    import: 'default'
});

function sourceFor(sources: Record<string, string>, component: string, suffix: string): string {
    const entry = Object.entries(sources).find(([path]) =>
        path.endsWith(`/components/${component}/${suffix}`)
    );
    if (!entry) throw new Error(`Missing ${suffix} for ${component}`);
    return entry[1];
}

function fence(language: string, content: string): string {
    return `~~~~${language}\n${content.trim()}\n~~~~`;
}

function titleFromFile(path: string): string {
    return path
        .slice(path.lastIndexOf('/') + 1)
        .replace(/\.svelte$/, '')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function componentMarkdown(component: string): string | undefined {
    if (!components.includes(component as (typeof components)[number])) return undefined;

    const manifestEntry = Object.entries(manifests).find(([path]) =>
        path.endsWith(`/components/${component}/manifest.ts`)
    );
    if (!manifestEntry) throw new Error(`Missing manifest for ${component}`);

    const manifest = manifestEntry[1].manifest;
    const componentExamples = Object.entries(examples)
        .filter(([path]) => path.includes(`/components/${component}/examples/`))
        .sort(([left], [right]) => left.localeCompare(right));
    const dependencies = manifest.components.length ? manifest.components.join(', ') : 'None';
    const shared = manifest.shared.length ? manifest.shared.join(', ') : 'None';
    const install =
        manifest.visibility === 'public'
            ? fence('sh', `bunx --package @sivir-ui/svelte sivir add ${component}`)
            : [
                  'This component is available from the package API but is not a standalone CLI registry target.',
                  '',
                  fence('sh', 'bun add @sivir-ui/svelte')
              ].join('\n');

    return [
        `# ${sanitizeComponent(component)}`,
        '',
        manifest.description,
        '',
        `- Package: \`@sivir-ui/svelte\``,
        `- Component version: \`${manifest.version}\``,
        `- Depends on Sivir components: ${dependencies}`,
        `- Shared utilities: ${shared}`,
        '',
        '## Install',
        '',
        install,
        '',
        '## API',
        '',
        'This reference is generated at build time from the component manifest, public `index.ts`, and documentation examples below. Changes to those source files are reflected here in the published Markdown. Standard Svelte and HTML attributes accepted by the exported prop types are supported.',
        '',
        fence('ts', sourceFor(indexes, component, 'index.ts')),
        ...(componentExamples.length
            ? [
                  '',
                  '## Examples',
                  ...componentExamples.flatMap(([path, source]) => [
                      '',
                      `### ${titleFromFile(path)}`,
                      '',
                      fence('svelte', source)
                  ])
              ]
            : []),
        '',
        `For the rendered reference, visit [/docs/components/${component}](/docs/components/${component}).`,
        ''
    ].join('\n');
}

export function brandMarkMarkdown(): string {
    return [
        '# Brand Mark',
        '',
        'The Sivir brand mark is a package-only visual asset. It is exported from the package root and the dedicated `brand-mark` path, but it is not a CLI registry component.',
        '',
        '## Install',
        '',
        fence('sh', 'bun add @sivir-ui/svelte'),
        '',
        '## API',
        '',
        '- `size?: number` sets both dimensions in pixels and defaults to `30`.',
        '- `class?: string` adds utility classes to the outer `span`.',
        '- `label?: string` gives the mark an accessible image name. Without a label, the mark is decorative and hidden from assistive technology.',
        '',
        '## Example',
        '',
        fence(
            'svelte',
            `import { BrandMark } from '@sivir-ui/svelte';\n\n<BrandMark size={36} label="Sivir" />`
        ),
        '',
        'For a narrower import, use `@sivir-ui/svelte/brand-mark`.',
        ''
    ].join('\n');
}

const coreDocs = {
    introduction: `# Introduction

Sivir UI is a Svelte 5 and Tailwind CSS v4 component library. Install it as a package or use the CLI to copy component source into your project.

## Requirements

- Svelte 5
- Tailwind CSS v4

## Quick start

~~~~sh
bun add @sivir-ui/svelte
# then in your CSS:
# @import '@sivir-ui/svelte/ui.css';
~~~~

~~~~sh
bunx --package @sivir-ui/svelte sivir init -y
bunx --package @sivir-ui/svelte sivir add button
~~~~
`,
    installation: `# Installation

Install Sivir as a package when you want dependency-managed components, or initialize it with the CLI when you want to own the copied source.

## Package

~~~~sh
bun add @sivir-ui/svelte
~~~~

Add the token sheet to your CSS:

~~~~css
@import '@sivir-ui/svelte/ui.css';
~~~~

## CLI

~~~~sh
bunx --package @sivir-ui/svelte sivir init
bunx --package @sivir-ui/svelte sivir add button
~~~~
`,
    theming: `# Theming

Sivir components use CSS custom properties from \`@sivir-ui/svelte/ui.css\`. Import that stylesheet, then override the tokens in your application CSS to adapt colors, radii, typography, and spacing to your product.

See the rendered guide at [/docs/theming](/docs/theming) for token examples and theme presets.
`
} as const;

export function coreMarkdown(page: keyof typeof coreDocs): string {
    return coreDocs[page];
}

export function llmsTxt(origin: string): string {
    const links = [
        ['Introduction', '/docs/introduction.md'],
        ['Installation', '/docs/installation.md'],
        ['Theming', '/docs/theming.md'],
        ['Components index', '/docs/components.md'],
        ['Brand Mark', '/docs/brand-mark.md'],
        ...changelogVersions.map((version) => [`Changelog ${version}`, `/changelog/${version}`]),
        ...components.map((component) => [
            sanitizeComponent(component),
            `/docs/components/${component}.md`
        ])
    ];

    return [
        '# Sivir UI',
        '',
        'Svelte 5 and Tailwind CSS v4 component library. Use these Markdown resources for implementation details, public APIs, runnable examples, and version-specific upgrade notes.',
        '',
        `The current catalog contains ${components.length} components. Brand Mark is a package-only asset. Approval Request, Marquee, Panel, and Separator were removed as standalone components; migration guidance is in the components index.`,
        '',
        '## Documentation',
        '',
        ...links.map(([title, path]) => `- [${title}](${new URL(path, origin).href})`),
        ''
    ].join('\n');
}

export function componentsMarkdown(): string {
    return [
        '# Sivir UI components',
        '',
        'Each component reference is generated at build time from its package manifest, public API source, and Svelte examples. Published Markdown reflects changes to those canonical sources.',
        '',
        ...components.map(
            (component) => `- [${sanitizeComponent(component)}](/docs/components/${component}.md)`
        ),
        '',
        '## Package assets',
        '',
        '- [Brand Mark](/docs/brand-mark.md) - package-only logo component; not available through `sivir add`.',
        '',
        '## Removed components',
        '',
        'These names are no longer standalone package exports or CLI installation targets.',
        '',
        ...removedComponents.map(({ name, guidance }) => `- **${name}:** ${guidance}`),
        ''
    ].join('\n');
}
