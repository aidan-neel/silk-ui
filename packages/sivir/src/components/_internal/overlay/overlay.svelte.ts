import {
    clickOutside,
    getFocusableElements,
    inertOutside,
    lockBodyScroll,
    pushEscapeLayer,
    trapFocus
} from '@sivir-ui/svelte/utils';
import { getContext, setContext } from 'svelte';

type OverlayKind = 'modal' | 'sheet' | 'other';

const OVERLAY_DEPTH = Symbol('sivir-overlay-depth');

type OverlayLayer = {
    panel: HTMLElement;
    kind: OverlayKind;
    depth: number;
};

const overlayStack: OverlayLayer[] = [];

function overlayNestingDepth() {
    const parentDepth = getContext<number>(OVERLAY_DEPTH) ?? 0;
    const depth = parentDepth + 1;
    setContext(OVERLAY_DEPTH, depth);
    return depth;
}

/**
 * Depth of the overlay enclosing the caller's component subtree.
 *
 * Portaled content (popover menus, select lists) keeps its component-tree
 * position when its DOM moves to `<body>`, so a menu opened inside a modal
 * still reads depth 1 here. Floating layers register their Escape handler
 * one rank above this depth so they peel before their enclosing overlay.
 * Call during component init; `getContext` is init-scoped.
 */
export function parentOverlayDepth() {
    return getContext<number>(OVERLAY_DEPTH) ?? 0;
}

function applyOverlayRootLayer(panel: HTMLElement, depth: number) {
    const root = panel.closest('[data-overlay-root]');
    if (!(root instanceof HTMLElement)) {
        return;
    }
    root.style.position = 'relative';
    root.style.zIndex = String(100 + depth);
}

function clearOverlayRootLayer(panel: HTMLElement) {
    const root = panel.closest('[data-overlay-root]');
    if (!(root instanceof HTMLElement)) {
        return;
    }
    root.style.removeProperty('position');
    root.style.removeProperty('z-index');
}

function overlayKind(panel: HTMLElement): OverlayKind {
    const ui = panel.dataset.ui;
    if (ui === 'modal-panel') {
        return 'modal';
    }
    if (ui === 'sheet-content') {
        return 'sheet';
    }
    return 'other';
}

function modalScrim(panel: HTMLElement) {
    return panel
        .closest('[data-overlay-root]')
        ?.querySelector<HTMLElement>('[data-ui="modal-overlay"]');
}

function clearModalStackAttrs(panel: HTMLElement) {
    panel.removeAttribute('data-stacked');
    panel.closest('[data-overlay-root]')?.removeAttribute('aria-hidden');
    modalScrim(panel)?.removeAttribute('data-nested');
}

function syncStackedModals() {
    const modals = overlayStack
        .filter((layer) => layer.kind === 'modal')
        .slice()
        .sort((a, b) => a.depth - b.depth);
    for (const layer of modals) {
        const modalIndex = modals.indexOf(layer);
        const behind = modalIndex >= 0 && modalIndex < modals.length - 1;
        const nested = modalIndex > 0;
        const root = layer.panel.closest('[data-overlay-root]');
        const scrim = modalScrim(layer.panel);
        applyOverlayRootLayer(layer.panel, layer.depth);
        if (behind) {
            layer.panel.setAttribute('data-stacked', 'behind');
            root?.setAttribute('aria-hidden', 'true');
            layer.panel.setAttribute('aria-modal', 'false');
        } else {
            layer.panel.removeAttribute('data-stacked');
            root?.removeAttribute('aria-hidden');
            layer.panel.setAttribute('aria-modal', 'true');
        }
        if (nested) {
            scrim?.setAttribute('data-nested', '');
        } else {
            scrim?.removeAttribute('data-nested');
        }
    }
}

/** Test isolation for the process-local nested overlay stack. */
export function resetOverlayStackForTests() {
    overlayStack.length = 0;
}

/**
 * Shared overlay primitive for modal-content and sheet-content.
 *
 * Owns the cross-cutting overlay concerns:
 *   - Focus trap (initial focus on first focusable, Tab cycling).
 *   - Click-outside detection (panel boundary; respects allowClickOutside).
 *   - Escape key handler (panel-scoped, fires onClose).
 *   - Body scroll lock while open (shared refcount with Popover).
 *   - Inert background while open (shared refcount with Popover).
 *   - Nested modal stacking (recede the earlier panel, lighter nested scrim).
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

export function useOverlay(opts: OverlayOptions) {
    const depth = overlayNestingDepth();

    $effect(() => {
        if (!opts.isOpen()) {
            return;
        }
        const panel = opts.panelEl();
        if (!panel) {
            return;
        }
        if (typeof document === 'undefined') {
            return;
        }

        const lockScroll = opts.lockScroll !== false;
        const inert = opts.inert !== false;
        const layer = {
            panel,
            kind: overlayKind(panel),
            depth
        };
        overlayStack.push(layer);
        overlayStack.sort((a, b) => a.depth - b.depth);
        applyOverlayRootLayer(panel, depth);
        syncStackedModals();

        const cleanupTrap = trapFocus(panel, {
            initialFocus: getFocusableElements(panel)[0] ?? null,
            returnFocus: opts.returnFocus?.()
        });

        const releaseScroll = lockScroll ? lockBodyScroll() : undefined;
        const releaseInert = inert ? inertOutside([panel]) : undefined;

        const co = clickOutside(panel, () => {
            if (opts.allowClickOutside?.() ?? true) {
                opts.onClose();
            }
        });

        const releaseEscape = pushEscapeLayer(
            () => {
                if (opts.allowEscape?.() ?? true) {
                    opts.onClose();
                }
            },
            panel,
            depth
        );

        return () => {
            const index = overlayStack.lastIndexOf(layer);
            if (index >= 0) {
                overlayStack.splice(index, 1);
            }
            clearOverlayRootLayer(panel);
            clearModalStackAttrs(panel);
            syncStackedModals();
            releaseInert?.();
            cleanupTrap?.();
            co.destroy();
            releaseEscape();
            releaseScroll?.();
        };
    });
}
