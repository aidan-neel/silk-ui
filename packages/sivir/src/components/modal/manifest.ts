import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Modal -- centered dialog overlay. Composes `_internal/overlay` for the
 * shared focus-trap / click-outside / Escape / body-scroll-lock concerns;
 * owns its own portal, Svelte enter/exit transitions, and centered positioning.
 *
 * Wrapped by `alert-dialog`.
 *
 * Version history:
 *   1.0.0 -- initial manifest. Modal-content consumes `_internal/overlay`
 *           (resolves F-30). The public component API (Root, Content,
 *           Trigger, Title, Description, Header, Body, Close, Footer,
 *           Confirm) is stable.
 */
export const manifest: Manifest = {
    name: 'modal',
    version: '1.1.1',
    visibility: 'public',
    description:
        'Centered dialog overlay with portal, focus trap, click-outside, and Svelte transitions. Composes _internal/overlay for shared mechanics.',
    role: 'dialog',
    files: [
        'components/modal/modal.svelte',
        'components/modal/modal-content.svelte',
        'components/modal/modal-trigger.svelte',
        'components/modal/modal-title.svelte',
        'components/modal/modal-description.svelte',
        'components/modal/modal-header.svelte',
        'components/modal/modal-footer.svelte',
        'components/modal/modal-body.svelte',
        'components/modal/modal-close.svelte',
        'components/modal/modal-confirm.svelte',
        'components/modal/context.svelte.ts',
        'components/modal/index.ts',
        'components/modal/manifest.ts'
    ],
    components: ['button', '_internal/overlay', 'typography'],
    shared: ['utils.cn', 'utils.createContext', 'is-dark', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
