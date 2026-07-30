import type { Manifest } from '@sivir/ui/_manifest/types';

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
export const manifest: Manifest = {
	name: 'toast',
	version: '2.1.0',
	visibility: 'public',
	description:
		'Toast notification system with body-portaled Toaster, free-function toast() API, and a shared client stack (SSR-safe).',
	files: [
		'components/toast/lib.svelte.ts',
		'components/toast/toaster.svelte',
		'components/toast/toast.svelte',
		'components/toast/variants.ts',
		'components/toast/index.ts',
		'components/toast/manifest.ts'
	],
	components: ['button'],
	shared: ['utils.cn', 'transition'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		cnfast: '^0.0.8',
		'tailwind-merge': '^3.0.0',
		'tailwind-variants': '^3.0.0',
		svelte: '^5.0.0'
	}
};
