export const manifest = {
    name: 'task-steps',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Ordered task progress with pending, active, completed, and failed states plus settled screen-reader announcements.',
    files: [
        'components/task-steps/task-steps.svelte',
        'components/task-steps/index.ts',
        'components/task-steps/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
