export const manifest = {
    name: 'badge',
    version: '1.0.0',
    visibility: 'public',
    description: 'Inline status pill with optional dot marker. 9 variants (5 intents + 4 statuses). Optionally renders as anchor when href is provided.',
    files: [
        'components/badge/badge.svelte',
        'components/badge/variants.ts',
        'components/badge/index.ts',
        'components/badge/manifest.ts'
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
