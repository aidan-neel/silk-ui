const skillFiles = import.meta.glob<string>('../../../../skills/sivir/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
});

const FETCH_INDEX =
    'Fetch `https://sivir.dev/llms.txt` at the start of each Sivir task. Treat it as the index for the current catalog, installation guide, theming guide, changelog, and generated component references.';

const EMBEDDED_INDEX =
    'This file is the live Sivir index. Use the Documentation links below for the current catalog, installation guide, theming guide, changelog, and generated component references.';

function skillFile(suffix: string): string {
    const entry = Object.entries(skillFiles).find(([path]) => {
        return path.endsWith(suffix);
    });
    if (!entry) {
        throw new Error(`Missing skill file ${suffix}`);
    }

    return entry[1];
}

function stripFrontmatter(markdown: string): string {
    return markdown.replace(/^---\n[\s\S]*?\n---\n+/, '');
}

function withOrigin(markdown: string, origin: string): string {
    const componentSelection = `${origin}/docs/component-selection.md`;
    const designLanguage = `${origin}/docs/design-language.md`;

    return markdown
        .replaceAll('https://sivir.dev/llms.txt', `${origin}/llms.txt`)
        .replaceAll(
            '`references/component-selection.md` from this skill',
            `[component selection](${componentSelection})`
        )
        .replaceAll(
            '`references/design-language.md` from this skill',
            `[design language](${designLanguage})`
        )
        .replaceAll(
            '`references/design-language.md` relative to this skill',
            `[design language](${designLanguage})`
        )
        .replaceAll(
            '`references/component-selection.md` relative to this skill',
            `[component selection](${componentSelection})`
        );
}

function demoteHeadings(markdown: string): string {
    return markdown.replaceAll(/^(#{1,5}) /gm, (_, hashes: string) => {
        return `${hashes}# `;
    });
}

export function skillMarkdown(origin: string): string {
    return `${withOrigin(stripFrontmatter(skillFile('/SKILL.md')).trim(), origin)}\n`;
}

export function sivirGuideMarkdown(origin: string): string {
    const body = stripFrontmatter(skillFile('/SKILL.md'))
        .replace(FETCH_INDEX, EMBEDDED_INDEX)
        .replace(/^# Sivir\n+/, '');

    return withOrigin(demoteHeadings(body).trim(), origin);
}

export function componentSelectionMarkdown(origin: string): string {
    return `${withOrigin(skillFile('/references/component-selection.md').trim(), origin)}\n`;
}

export function designLanguageMarkdown(origin: string): string {
    return `${withOrigin(skillFile('/references/design-language.md').trim(), origin)}\n`;
}
