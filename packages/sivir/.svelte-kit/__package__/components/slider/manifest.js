export const manifest = {
    name: 'slider',
    version: '1.0.0',
    visibility: 'public',
    description: 'Range input slider with bindable value, min/max/step, and ARIA value attributes.',
    role: 'slider',
    files: [
        'components/slider/slider.svelte',
        'components/slider/index.ts',
        'components/slider/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
