import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'attachment',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Validated local-file picker with drag and drop, previews, status, and progress display.',
    files: [
        'components/attachment/attachment.svelte',
        'components/attachment/attachment-trigger.svelte',
        'components/attachment/attachment-list.svelte',
        'components/attachment/attachment-item.svelte',
        'components/attachment/context.svelte.ts',
        'components/attachment/index.ts',
        'components/attachment/manifest.ts'
    ],
    components: ['button'],
    shared: ['utils.cn', 'utils.createContext', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.7.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
