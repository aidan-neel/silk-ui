import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'tabs',
    version: '1.1.0',
    visibility: 'public',
    description:
        'Horizontal or vertical tabbed interface with List, Trigger, and Content subparts. Supports three visual variants and a bindable active value.',
    role: 'tablist',
    files: [
        'components/tabs/tabs.svelte',
        'components/tabs/tabs-list.svelte',
        'components/tabs/tabs-trigger.svelte',
        'components/tabs/tabs-content.svelte',
        'components/tabs/id.ts',
        'components/tabs/index.ts',
        'components/tabs/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'utils.pressable'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
