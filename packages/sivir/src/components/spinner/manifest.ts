import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'spinner',
    version: '1.0.0',
    visibility: 'public',
    description: 'An animated loading indicator that can resolve to a checkmark.',
    files: [
        'components/spinner/spinner.svelte',
        'components/spinner/index.ts',
        'components/spinner/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.7.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
