import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Overlay -- internal primitive. Shared by modal-content and sheet-content
 * (and any future overlay-based component). Owns focus trap, click-outside,
 * Escape, and body-scroll lock. Consumer of overlay owns its own animation
 * surface and portal/positioning.
 *
 * Internal visibility -- the CLI installs this as a transitive dependency
 * only. `npx sivir add overlay` is not a valid command; consumers reach
 * overlay only through modal or sheet.
 *
 * Version history:
 *   1.0.0 -- initial release. Extracted from the duplicated focus-trap /
 *           click-outside / Escape / body-overflow logic that lived in
 *           modal-content.svelte and sheet-content.svelte (resolves F-30).
 *   1.2.0 -- inert the background while open; scroll lock also covers nested
 *           overflow containers so page regions other than `document.body`
 *           cannot scroll behind the overlay.
 *   1.3.0 -- nested modal stacking: recede the earlier panel, lighten the
 *           nested scrim, and dismiss only the top layer. Click-outside
 *           peels one layer per pointer gesture so Select inside Modal
 *           does not close the dialog.
 */
export const manifest: Manifest = {
    name: '_internal/overlay',
    version: '1.3.0',
    visibility: 'internal',
    description:
        'Shared overlay primitive owning focus trap, inert background, click-outside, Escape handling, body-scroll lock, and nested modal stacking. Consumed by modal and sheet; not directly installable.',
    files: [
        'components/_internal/overlay/overlay.svelte.ts',
        'components/_internal/overlay/index.ts',
        'components/_internal/overlay/manifest.ts'
    ],
    components: [],
    shared: [
        'utils.clickOutside',
        'utils.getFocusableElements',
        'utils.inertOutside',
        'utils.trapFocus',
        'utils.lockBodyScroll',
        'utils.pushEscapeLayer'
    ],
    peerDependencies: {
        svelte: '^5.0.0'
    }
};
