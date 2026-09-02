/**
 * Shared overlay primitive for modal-content and sheet-content.
 *
 * Owns the cross-cutting overlay concerns:
 *   - Focus trap (initial focus on first focusable, Tab cycling).
 *   - Click-outside detection (panel boundary; respects allowClickOutside).
 *   - Escape key handler (panel-scoped, fires onClose).
 *   - Body scroll lock while open (shared refcount with Popover).
 *   - Inert background while open (shared refcount with Popover).
 *
 * Consumer owns:
 *   - The panel DOM element (bind via `panelEl` getter).
 *   - The portal/positioning decision (the wrapper around the panel).
 *   - The animation surface (transitions on the consumer's own elements).
 *
 * Internal primitive per pattern guide Sec.2.5 -- not consumer-installable.
 * Modal and sheet auto-pull this; consumers cannot `npx sivir add overlay`.
 */
export type OverlayOptions = {
    /** Reactive getter for the open state. */
    isOpen: () => boolean;
    /** Reactive getter for the panel element to trap focus inside. */
    panelEl: () => HTMLElement | undefined;
    /** Fires when the user dismisses (Escape or click-outside). */
    onClose: () => void;
    /** Reactive getter -- when false, click-outside does not call onClose. */
    allowClickOutside?: () => boolean;
    /** Reactive getter -- when false, Escape does not call onClose. */
    allowEscape?: () => boolean;
    /** Element that receives focus again after the overlay closes. */
    returnFocus?: () => HTMLElement | undefined;
    /** Lock body scroll while open. Defaults to true. */
    lockScroll?: boolean;
    /** Make document content outside the overlay inert. Defaults to true. */
    inert?: boolean;
};
export declare function useOverlay(opts: OverlayOptions): void;
