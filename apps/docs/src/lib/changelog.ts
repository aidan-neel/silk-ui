type ChangelogEntry = {
    type: string;
    content: string;
};

const LLM_TYPE = 'llm';

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
            if (!parsed || parsed.version !== version || parsed.type === LLM_TYPE) {
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

export const changelogLlmVersions = changelogVersions.filter((version) => {
    return Object.keys(sources).some((path) => {
        const parsed = changelogPath(path);
        return parsed?.version === version && parsed.type === LLM_TYPE;
    });
});

export function changelogLlmMarkdown(version: string): string | undefined {
    const entry = Object.entries(sources).find(([path]) => {
        const parsed = changelogPath(path);
        return parsed?.version === version && parsed.type === LLM_TYPE;
    });
    if (!entry) {
        return undefined;
    }

    const content = entry[1].trim();
    if (!content) {
        return undefined;
    }

    return [
        `# @sivir-ui/svelte ${version} LLM changelog`,
        '',
        'Context for coding agents upgrading or composing against this release. The human changelog is the short bullet list; this page covers only changes that need migration or composition detail.',
        '',
        content,
        ''
    ].join('\n');
}

export function changelogMarkdown(version: string): string | undefined {
    const entries = entriesFor(version);
    if (!entries.length) {
        return undefined;
    }

    return [
        `# @sivir-ui/svelte ${version} changelog`,
        '',
        'This document aggregates the release notes for this version. Review it before integrating or upgrading Sivir.',
        ...(changelogLlmVersions.includes(version)
            ? [
                  '',
                  `Large changes for this release have an LLM context page at [/changelog/${version}/llm.md](/changelog/${version}/llm.md).`
              ]
            : []),
        ...entries.flatMap((entry) => ['', `## ${titleFromType(entry.type)}`, '', entry.content]),
        ''
    ].join('\n');
}

export function changelogDocsMarkdown(): string {
    return changelogVersions
        .flatMap((version) => {
            const entries = entriesFor(version);
            if (!entries.length) {
                return [];
            }

            return [
                `## ${version}`,
                '',
                ...entries.flatMap((entry) => {
                    return [`### ${titleFromType(entry.type)}`, '', entry.content, ''];
                })
            ];
        })
        .join('\n')
        .trim();
}
