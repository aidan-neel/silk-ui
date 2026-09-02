import { changelogLlmVersions, changelogVersions } from '$lib/changelog';
import { components } from '$lib/components';

export const htmlDocPaths = [
    '/',
    '/docs/introduction',
    '/docs/installation',
    '/docs/theming',
    '/docs/changelog',
    '/docs/components',
    '/studio',
    ...components.map((component) => `/docs/components/${component}`)
];

export const llmDocPaths = [
    '/llms.txt',
    '/docs/introduction.md',
    '/docs/installation.md',
    '/docs/theming.md',
    '/docs/changelog.md',
    '/docs/components.md',
    '/docs/brand-mark.md',
    '/docs/skill.md',
    '/docs/component-selection.md',
    '/docs/design-language.md',
    ...changelogVersions.map((version) => `/changelog/${version}.md`),
    ...changelogLlmVersions.map((version) => `/changelog/${version}/llm.md`),
    ...components.map((component) => `/docs/components/${component}.md`)
];

export function sitemapPaths(): string[] {
    return [...htmlDocPaths, ...llmDocPaths];
}
