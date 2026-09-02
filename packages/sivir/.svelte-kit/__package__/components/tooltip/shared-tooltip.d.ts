/**
 * A single shared tooltip surface.
 *
 * Every Tooltip.Trigger drives this one element, so moving from one trigger to
 * another *morphs* the same bubble -- the background stays put while it slides
 * and reshapes around the new label.
 *
 * Centering trick: the bubble is anchored by its *center* (left = trigger
 * centre + `translateX(-50%)`), so its width can change freely without ever
 * drifting off the trigger.
 *
 * Presentation lives in `ui.css` under `.sivir-tooltip`.
 */
import { type Placement } from '@floating-ui/dom';
/** Hover/focus a trigger: show after `delay`, or morph instantly if one is already up. */
export declare function showTooltip(ref: HTMLElement, text: string, placement?: Placement, delay?: number, className?: string): void;
/** Re-label the active bubble in place (for example, a Copy→Copied flip). */
export declare function updateTooltipText(ref: HTMLElement, text: string): void;
export declare function updateTooltipClass(ref: HTMLElement, className: string): void;
/** Force the bubble up now and, unless the pointer is over the trigger, auto-hide after `holdMs`. */
export declare function flashTooltip(ref: HTMLElement, text: string, placement?: Placement, holdMs?: number, className?: string): void;
/** Leave/blur a trigger: schedule a hide, ignored if a different trigger took over. */
export declare function hideTooltip(ref: HTMLElement | null, closeDelay?: number): void;
/**
 * Test-only: tear down the shared bubble and clear its timers/state so browser
 * suites don't leak an open tooltip (or a pending open timer) from one case
 * into the next.
 */
export declare function resetSharedTooltipForTests(): void;
export declare function isActiveTooltip(ref: HTMLElement): boolean;
