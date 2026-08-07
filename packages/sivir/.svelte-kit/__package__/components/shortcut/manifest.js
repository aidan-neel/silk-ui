export const manifest = {
    name: 'shortcut',
    version: '1.0.0',
    visibility: 'public',
    description: 'Keyboard shortcut indicator. Activates its nearest interactive owner or an explicit ontrigger callback.',
    files: [
        'components/shortcut/shortcut.svelte',
        'components/shortcut/index.ts',
        'components/shortcut/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
