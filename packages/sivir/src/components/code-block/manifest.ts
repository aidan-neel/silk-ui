import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'code-block',
    version: '1.2.0',
    visibility: 'public',
    description:
        'Code block with syntax-highlighted snippets, a rolling plain-text multi-language switcher, built-in copy button, and an actions slot. Highlighting via highlight.js.',
    role: 'tablist',
    files: [
        'components/code-block/code-block.svelte',
        'components/code-block/code-block-header.svelte',
        'components/code-block/code-block-list.svelte',
        'components/code-block/code-block-trigger.svelte',
        'components/code-block/code-block-actions.svelte',
        'components/code-block/code-block-copy.svelte',
        'components/code-block/code-block-content.svelte',
        'components/code-block/code-block-roll.svelte',
        'components/code-block/highlight.ts',
        'components/code-block/index.ts',
        'components/code-block/manifest.ts'
    ],
    components: ['tabs', 'copy-button', 'card'],
    shared: ['utils.cn'],
    peerDependencies: {
        '@scritto/svelte': '^0.1.0',
        'highlight.js': '^11.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
