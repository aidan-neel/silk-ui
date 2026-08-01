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
 */
export const manifest = {
    name: '_internal/overlay',
    version: '1.0.0',
    visibility: 'internal',
    description: 'Shared overlay primitive owning focus trap, click-outside, Escape handling, and body-scroll lock. Consumed by modal and sheet; not directly installable.',
    files: [
        'components/_internal/overlay/overlay.svelte.ts',
        'components/_internal/overlay/index.ts',
        'components/_internal/overlay/manifest.ts'
    ],
    components: [],
    shared: [
        'utils.clickOutside',
        'utils.getFocusableElements',
        'utils.trapFocus',
        'utils.lockBodyScroll',
        'utils.pushEscapeLayer'
    ],
    peerDependencies: {
        svelte: '^5.0.0'
    }
};
