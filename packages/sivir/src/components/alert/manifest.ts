import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'alert',
    version: '1.0.0',
    visibility: 'public',
    description: 'Inline status callout with 4 variants (info, success, warning, error).',
    role: 'alert',
    files: [
        'components/alert/alert.svelte',
        'components/alert/alert-title.svelte',
        'components/alert/alert-description.svelte',
        'components/alert/variants.ts',
        'components/alert/index.ts',
        'components/alert/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        'tailwind-merge': '^3.0.0',
        'tailwind-variants': '^3.0.0',
        svelte: '^5.0.0'
    }
};
