export const manifest = {
    name: 'tool',
    version: '1.2.0',
    visibility: 'public',
    description: 'Compact, expandable AI tool calls for chat transcripts. Use variant="quiet" for a low-emphasis, no-hover-fill task summary.',
    files: [
        'components/tool/tool.svelte',
        'components/tool/tool-item.svelte',
        'components/tool/tool-input.svelte',
        'components/tool/tool-output.svelte',
        'components/tool/index.ts',
        'components/tool/manifest.ts'
    ],
    components: ['spinner'],
    shared: ['utils.cn', 'utils.pressable', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
