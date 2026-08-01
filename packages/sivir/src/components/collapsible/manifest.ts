import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'collapsible',
    version: '1.0.0',
    visibility: 'public',
    description: 'Single-item disclosure panel with bindable open state.',
    files: [
        'components/collapsible/collapsible.svelte',
        'components/collapsible/collapsible-trigger.svelte',
        'components/collapsible/collapsible-content.svelte',
        'components/collapsible/context.svelte.ts',
        'components/collapsible/index.ts',
        'components/collapsible/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'utils.createContext', 'transition'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
