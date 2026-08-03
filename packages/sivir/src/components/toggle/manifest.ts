import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'toggle',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Two-state toggle button with bindable pressed state, sizes (sm/md/lg), variants (default/outlined).',
    files: [
        'components/toggle/toggle.svelte',
        'components/toggle/variants.ts',
        'components/toggle/index.ts',
        'components/toggle/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        'tailwind-merge': '^3.0.0',
        'tailwind-variants': '^3.0.0',
        svelte: '^5.0.0'
    }
};
