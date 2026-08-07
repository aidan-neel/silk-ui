export const manifest = {
    name: 'prompt-composer',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Controlled agent-message form with autoresizing input, toolbar, and send/stop action.',
    files: [
        'components/prompt-composer/prompt-composer.svelte',
        'components/prompt-composer/prompt-composer-input.svelte',
        'components/prompt-composer/prompt-composer-toolbar.svelte',
        'components/prompt-composer/prompt-composer-actions.svelte',
        'components/prompt-composer/prompt-composer-submit.svelte',
        'components/prompt-composer/context.svelte.ts',
        'components/prompt-composer/index.ts',
        'components/prompt-composer/manifest.ts'
    ],
    components: ['button'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.7.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
