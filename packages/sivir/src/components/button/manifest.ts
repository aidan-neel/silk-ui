import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Button is the stability anchor of the sivir library.
 * Fan-in ~12 -- every interactive component pulls it.
 *
 * Version history:
 *   1.0.0 -- initial state.
 *   2.0.0:
 *           - Rename `onhover` -> `onpointerenter` (DOM-aligned naming).
 *           - Rename `onhoverend` -> `onpointerleave`.
 *           - DOM event listener switched from `mouseenter`/`mouseleave`
 *             to `pointerenter`/`pointerleave`.
 *           - Remove the vestigial `ButtonState` exported type.
 *           - Document the `element` union narrowing pattern in JSDoc.
 *   3.0.0:
 *           - Delete the typed `onpointerenter` / `onpointerleave` props
 *             from `ButtonProps` entirely. Empirical grep verification
 *             across the entire codebase showed zero call-sites -- the
 *             hooks were dead API even after the rename. Consumers
 *             needing pointer-event callbacks can pass them through the
 *             standard HTML attribute spread (`...HTMLButtonAttributes`
 *             or `...HTMLAnchorAttributes`); the dedicated typed props
 *             are gone.
 *           - Coordinated with the F-29 collapse of tooltip and
 *             hover-card into popover wrappers.
 *   3.2.0:
 *           - Add the `panel` variant: a clickable Button with Panel-compatible
 *             token fallbacks and no component dependency.
 */
export const manifest: Manifest = {
	name: 'button',
	version: '3.2.0',
	visibility: 'public',
	description:
		'Click target with 6 intent variants and 4 sizes. Renders as <button> by default; renders as <a> when `href` is provided. Universal trigger primitive -- pulled by every interactive sivir component.',
	files: [
		'components/button/button.svelte',
		'components/button/index.ts',
		'components/button/variants.ts',
		'components/button/manifest.ts'
	],
	components: [],
	shared: ['utils.cn', 'utils.Intent'],
	peerDependencies: {
		cnfast: '^0.0.8',
		'tailwind-merge': '^3.0.0',
		'tailwind-variants': '^3.0.0',
		svelte: '^5.0.0'
	}
};
