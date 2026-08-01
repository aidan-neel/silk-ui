export const manifest = {
    name: 'message',
    version: '1.0.0',
    visibility: 'public',
    description: 'Role-aware conversation messages with readable content and contextual actions.',
    files: [
        'components/message/message.svelte',
        'components/message/message-content.svelte',
        'components/message/message-actions.svelte',
        'components/message/context.svelte.ts',
        'components/message/index.ts',
        'components/message/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
