import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'file-diff',
    version: '1.3.0',
    visibility: 'public',
    description:
        'Unified file diff with a path top bar, addition/deletion counts, dual line-number gutters, and per-row syntax highlighting via highlight.js with a built-in GitHub palette; theme="custom" skips the token colors for any highlight.js theme stylesheet.',
    role: 'table',
    files: [
        'components/file-diff/file-diff.svelte',
        'components/file-diff/file-diff-top-bar.svelte',
        'components/file-diff/file-diff-filename.svelte',
        'components/file-diff/file-diff-plus-minus.svelte',
        'components/file-diff/file-diff-content.svelte',
        'components/file-diff/file-diff-row.svelte',
        'components/file-diff/file-diff-line-number.svelte',
        'components/file-diff/highlight.ts',
        'components/file-diff/index.ts',
        'components/file-diff/manifest.ts'
    ],
    components: ['_internal/highlight'],
    shared: ['utils.cn'],
    peerDependencies: {
        '@lucide/svelte': '^1.7.0',
        'highlight.js': '^11.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
