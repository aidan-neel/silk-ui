type ChangelogEntry = {
    type: string;
    content: string;
};

const sources = import.meta.glob<string>('../../../../changelog/*/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
});

function changelogPath(path: string): { version: string; type: string } | undefined {
    const match = path.match(/\/changelog\/([^/]+)\/([^/]+)\.md$/);
    if (!match) {
        return undefined;
    }

    return {
        version: match[1],
        type: match[2]
    };
}

function titleFromType(type: string): string {
    return type
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function entriesFor(version: string): ChangelogEntry[] {
    return Object.entries(sources)
        .flatMap(([path, content]) => {
            const parsed = changelogPath(path);
            if (!parsed || parsed.version !== version) {
                return [];
            }

            return [{ type: parsed.type, content: content.trim() }];
        })
        .sort((left, right) => left.type.localeCompare(right.type));
}

export const changelogVersions = [
    ...new Set(
        Object.keys(sources)
            .map(changelogPath)
            .flatMap((entry) => entry?.version ?? [])
    )
].sort((left, right) => right.localeCompare(left, undefined, { numeric: true }));

export function changelogMarkdown(version: string): string | undefined {
    const entries = entriesFor(version);
    if (!entries.length) {
        return undefined;
    }

    return [
        `# @sivir-ui/svelte ${version} changelog`,
        '',
        'This document aggregates the release notes for this version. Review it before integrating or upgrading Sivir.',
        ...entries.flatMap((entry) => ['', `## ${titleFromType(entry.type)}`, '', entry.content]),
        ''
    ].join('\n');
}
