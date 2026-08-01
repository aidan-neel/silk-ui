import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Toast.
 *
 * 1.0.0 -- initial. Module-level singleton (P3-F12 bug).
 * 2.0.0: per-Toaster-mount state. Module-level singleton removed.
 *        Free-function `toast(...)` is a no-op when no Toaster is mounted
 *        (e.g., SSR). Breaking change: the `toastUIState` named export
 *        is gone; consumers reading state directly switch to
 *        `getToastUIState()`.
 * 2.1.0: client-side shared store + single primary renderer + body
 *        portal. Toasts stack across page navigations; nested Toasters
 *        no longer split or mis-position the stack. SSR still no-ops.
 */
export declare const manifest: Manifest;
