import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Button from './button.svelte';
import type { Snippet } from 'svelte';
import type { Intent } from '@sivir-ui/svelte/utils';

export type ButtonVariant = Intent | 'panel' | 'quiet';
export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export type ButtonProps = {
    href?: string;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children?: Snippet;
    /**
     * Bindable reference to the rendered DOM element. Type is the union of
     * the two possible element types -- narrow at the use site:
     *
     * ```ts
     * let buttonEl: HTMLButtonElement | HTMLAnchorElement | undefined =
     *   $state();
     * // ...
     * <Button bind:element={buttonEl} href={undefined} />
     * if (buttonEl instanceof HTMLButtonElement) {
     *   buttonEl.focus();
     * }
     * ```
     *
     * Pass `href={undefined}` to guarantee a `<button>` element and narrow
     * to `HTMLButtonElement`; pass `href` to render an `<a>` element. The
     * union exists because both element types share the public API surface;
     * the type system can't distinguish without flow-sensitive analysis at
     * the call site.
     */
    element?: HTMLButtonElement | HTMLAnchorElement | undefined;
    /**
     * Skip the variant/size base classes and render with `class` alone.
     *
     * Menu rows use this to opt out of the button's sizing utilities so the
     * `sivir-menu-item` stylesheet contract governs the surface instead --
     * utilities outrank the `components` layer, so the two cannot coexist.
     */
    unstyled?: boolean;
    /** Controlled visual state. Loading remains focusable and refuses activation. */
    status?: ButtonStatus;
    /** Convenience alias for `status="loading"`. */
    loading?: boolean;
    loadingLabel?: string;
    successLabel?: string;
    errorLabel?: string;
    onclick?: (event: MouseEvent) => void;
} & Partial<HTMLButtonAttributes | HTMLAnchorAttributes>;

export { Button };
export default Button;
