import { type EasingFunction, type TransitionConfig } from 'svelte/transition';
/**
 * Reads a CSS duration variable and normalizes it to milliseconds.
 *
 * Each branch tests `Number.isFinite` rather than falling back with `||` so a
 * legitimate `0ms` -- the "None" motion preset -- survives instead of being
 * replaced by the fallback.
 */
export declare function getCssDuration(
    node: Element,
    variableName: string,
    fallback: number
): number;
/**
 * Unit-interval cubic-bezier easing with CSS-compatible control points.
 * Used for the iOS drawer curve, which Svelte's built-in easings cannot express.
 */
export declare function cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction;
export declare function panelIn(node: Element): TransitionConfig;
export declare function panelOut(node: Element): TransitionConfig;
/** Dialog enter: a soft centered scale that rises into place. */
export declare function dialogIn(node: Element): TransitionConfig;
/** Dialog exit: move slightly upward instead of retracing the enter path. */
export declare function dialogOut(node: Element): TransitionConfig;
export declare function overlayIn(node: Element): TransitionConfig;
export declare const overlayOut: typeof overlayIn;
export type SheetSide = 'left' | 'right';
/** Sheet enter: slides in from the anchored edge with the drawer curve. */
export declare function sheetIn(
    node: Element,
    params?: {
        side?: SheetSide;
    }
): TransitionConfig;
/** Sheet exit: same path, slightly faster so dismiss feels snappy. */
export declare function sheetOut(
    node: Element,
    params?: {
        side?: SheetSide;
    }
): TransitionConfig;
type ThemedSlideParams = {
    durationVar?: string;
    fallback?: number;
};
/** Vertical slide that reads its duration from a CSS motion variable. */
export declare const themedSlide: (node: Element, params?: ThemedSlideParams) => TransitionConfig;
export {};
