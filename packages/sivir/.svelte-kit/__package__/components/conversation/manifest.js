export const manifest = {
    name: 'conversation',
    version: '1.1.1',
    visibility: 'public',
    description: 'Auto-following conversation transcript with empty and jump-to-latest states.',
    files: [
        'components/conversation/conversation.svelte',
        'components/conversation/conversation-content.svelte',
        'components/conversation/conversation-empty.svelte',
        'components/conversation/conversation-scroll-button.svelte',
        'components/conversation/context.svelte.ts',
        'components/conversation/index.ts',
        'components/conversation/manifest.ts'
    ],
    components: ['scroll-area'],
    shared: ['utils.cn', 'utils.createContext', 'utils.pressable'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
