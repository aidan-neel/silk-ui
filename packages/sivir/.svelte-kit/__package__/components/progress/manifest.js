export const manifest = {
    name: 'progress',
    version: '1.0.0',
    visibility: 'public',
    description: 'Determinate and indeterminate progress bar.',
    role: 'progressbar',
    files: [
        'components/progress/progress.svelte',
        'components/progress/index.ts',
        'components/progress/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
