export const manifest = {
    name: 'question',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Inline agent question form with single-choice, multiple-choice, and free-text answers.',
    files: [
        'components/question/question.svelte',
        'components/question/question-title.svelte',
        'components/question/question-description.svelte',
        'components/question/question-options.svelte',
        'components/question/question-option.svelte',
        'components/question/question-input.svelte',
        'components/question/question-actions.svelte',
        'components/question/question-cancel.svelte',
        'components/question/question-submit.svelte',
        'components/question/context.svelte.ts',
        'components/question/index.ts',
        'components/question/manifest.ts'
    ],
    components: ['button', 'spinner', 'textarea'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.7.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    },
    role: ['form', 'group'],
    tier: 'tier-2'
};
