export const manifest = {
    name: 'reorder-list',
    version: '1.0.0',
    visibility: 'public',
    description: 'Accessible sortable list with pointer dragging, keyboard grab and move, cancellation, and commit announcements.',
    files: [
        'components/reorder-list/reorder-list.svelte',
        'components/reorder-list/index.ts',
        'components/reorder-list/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
