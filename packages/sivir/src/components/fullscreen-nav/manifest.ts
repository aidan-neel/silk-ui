import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'fullscreen-nav',
    version: '1.1.0',
    visibility: 'public',
    description: 'Mobile-focused full-viewport navigation overlay with grouped links.',
    role: 'dialog',
    files: [
        'components/fullscreen-nav/fullscreen-nav.svelte',
        'components/fullscreen-nav/fullscreen-nav-trigger.svelte',
        'components/fullscreen-nav/fullscreen-nav-content.svelte',
        'components/fullscreen-nav/fullscreen-nav-close.svelte',
        'components/fullscreen-nav/fullscreen-nav-group.svelte',
        'components/fullscreen-nav/fullscreen-nav-link.svelte',
        'components/fullscreen-nav/context.svelte.ts',
        'components/fullscreen-nav/index.ts',
        'components/fullscreen-nav/manifest.ts'
    ],
    components: ['button', '_internal/overlay'],
    shared: [
        'utils.cn',
        'utils.createContext',
        'utils.pressable',
        'utils.visualViewportBounds',
        'transition'
    ],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
