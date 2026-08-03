import { clickOutside, getFocusableElements, lockBodyScroll, pushEscapeLayer, trapFocus } from '@sivir-ui/svelte/utils';
export function useOverlay(opts) {
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
        const cleanupTrap = trapFocus(panel, {
            initialFocus: getFocusableElements(panel)[0] ?? null,
            returnFocus: opts.returnFocus?.()
        });
        const releaseScroll = lockScroll ? lockBodyScroll() : undefined;
        const co = clickOutside(panel, () => {
            if (opts.allowClickOutside?.() ?? true) {
                opts.onClose();
            }
        });
        const releaseEscape = pushEscapeLayer(() => {
            if (opts.allowEscape?.() ?? true) {
                opts.onClose();
            }
        });
        return () => {
            cleanupTrap?.();
            co.destroy();
            releaseEscape();
            releaseScroll?.();
        };
    });
}
