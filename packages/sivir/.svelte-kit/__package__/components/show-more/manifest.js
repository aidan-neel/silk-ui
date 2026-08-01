export const manifest = {
    name: 'show-more',
    version: '1.0.0',
    visibility: 'public',
    description: 'Clamps long content to a set number of lines and expands it on demand.',
    files: [
        'components/show-more/show-more.svelte',
        'components/show-more/index.ts',
        'components/show-more/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
