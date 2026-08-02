import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'reasoning',
    version: '1.2.0',
    visibility: 'public',
    description:
        'Expandable model reasoning status and trace for AI responses. Its trigger uses the Button quiet variant for a low-emphasis, no-hover-fill control.',
    files: [
        'components/reasoning/reasoning.svelte',
        'components/reasoning/reasoning-trigger.svelte',
        'components/reasoning/reasoning-content.svelte',
        'components/reasoning/context.svelte.ts',
        'components/reasoning/index.ts',
        'components/reasoning/manifest.ts'
    ],
    components: ['button'],
    shared: ['utils.cn', 'utils.createContext', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
