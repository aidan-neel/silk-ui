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
 *   3.3.0:
 *           - Add controlled loading, success, and error faces with stable width.
 *           - Give the outline variant a slightly firmer bottom edge.
 *   3.4.0:
 *           - Give success and error their own tonal surfaces so semantic text
 *             never clashes with the original Button variant background.
 */
export declare const manifest: Manifest;
