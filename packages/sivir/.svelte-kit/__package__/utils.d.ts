import { type Placement, type ReferenceElement } from '@floating-ui/dom';
import { type ClassValue } from 'cnfast';
import { type Snippet } from 'svelte';
export type DefaultProps = {
    class?: string;
    children?: Snippet;
} & Partial<Record<`data-${string}`, string | boolean | null>>;
/** The visual intents every interactive surface shares. */
export type Intent = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
/**
 * Merges class values and resolves Tailwind conflicts via cnfast.
 *
 * Sivir uses the `cn(className, extraClasses)` convention -- the consumer's
 * `className` first, library-side classes after. `.reverse()` flips the order
 * into twMerge so the first argument wins on conflicts, which keeps consumer
 * overrides ahead of library defaults.
 */
export declare function cn(...inputs: ClassValue[]): string;
/** Keeps fixed overlays within the browser's visual viewport, including above an on-screen keyboard. */
export declare function visualViewportBounds(node: HTMLElement): {
    destroy(): void;
};
/**
 * Builds a typed Svelte context pair for one component family.
 *
 * `name` is the kebab-case component name; it becomes both the context key
 * and the PascalCase name in the "used outside its root" error, so
 * `createContext('context-menu')` reports `<ContextMenu.Root>`.
 */
export declare function createContext<T>(name: string): {
    set(value: T): T;
    get(): T;
};
/**
 * Closes a menu layer and every ancestor above it (full submenu-cone collapse).
 *
 * Shared by context-menu and dropdown-menu, whose state objects differ but
 * both expose `open`.
 */
export declare function closeMenuLayers(current: {
    open: boolean;
}, ancestors: {
    open: boolean;
}[]): void;
/** Whether a pointer is in the contact triangle between a floating trigger and panel. */
export declare function isPointInSubmenuTriangle(point: {
    x: number;
    y: number;
}, trigger: DOMRect, panel: DOMRect, placement: Placement): boolean;
/**
 * Inerts document branches outside the given roots.
 *
 * Ancestors of each root stay active so a popover trigger can still dismiss,
 * while sibling branches, other overlay roots, and nodes added later are
 * excluded from pointer and keyboard interaction.
 */
export declare function inertOutside(activeRoots: HTMLElement[]): () => void;
/**
 * Locks document scrolling and returns a disposer.
 *
 * The lock is refcounted and shared by modal, sheet, and popover so nested
 * overlays cannot clear each other's lock on teardown -- only the last active
 * lock restores the original overflow and scrollbar padding. Overlay roots keep
 * their own overflow so dialog surfaces can still scroll.
 */
export declare function lockBodyScroll(): () => void;
/**
 * Marks non-overlay body children as non-interactive while a floating layer is
 * open. Overlay roots already portaled onto `document.body` stay active.
 */
export declare function lockBodyBackground(): () => void;
/** Test isolation for the process-local body locks. */
export declare function resetBodyLocksForTests(): void;
/**
 * Registers a close handler while a layer is open and returns a disposer.
 * Modal, sheet, and popover push on open and pop on teardown.
 */
export declare function pushEscapeLayer(close: () => void, element?: Element): () => void;
/** Test isolation for the escape stack. */
export declare function resetEscapeStackForTests(): void;
/** Returns the visible, interactive descendants inside a container. */
export declare function getFocusableElements(container: HTMLElement): HTMLElement[];
/** Keeps keyboard focus inside a container and restores the previous focus on cleanup. */
export declare function trapFocus(dialogEl: HTMLElement, options?: {
    initialFocus?: HTMLElement | null;
    returnFocus?: HTMLElement | null;
}): (() => void) | undefined;
/**
 * Constant-pixel press scale.
 *
 * Sets `--sivir-press-sx/sy` from the element's size and `--motion-press-px` so
 * a small and a large control shrink by the same number of pixels rather than
 * the same ratio. Listens in the capture phase so the variables are in place
 * before `:active` paints.
 */
export declare function pressable(node: HTMLElement): {
    destroy(): void;
};
type TravelingHighlightOptions = {
    itemSelector?: string;
    restingSelector?: string;
};
/**
 * Draws one highlight that travels between the active items in a collection.
 * Geometry is written directly so pointer movement never causes a component render.
 */
export declare function travelingHighlight(node: HTMLElement, options?: TravelingHighlightOptions): {
    destroy(): void;
};
/**
 * Runs a callback when a pointer event lands outside the node and any excluded
 * nodes.
 *
 * Floating layers (select, dropdown-menu, and friends) portal to `<body>` and
 * carry `data-floating-content`. Clicking one of their items closes that layer,
 * and Svelte flushes the removal synchronously *before* this document-level
 * listener runs, so the now-detached node drops out of `composedPath()`. The
 * target's own ancestor chain stays intact after the wrapper is detached, so it
 * serves as the fallback and keeps a parent overlay from being dismissed too.
 */
export declare function clickOutside(node: Node, callback: () => void, exclude?: Node[]): {
    destroy(): void;
};
/**
 * Positions a floating panel while keeping it inside the viewport bounds.
 *
 * Rejections are swallowed: Floating UI rejects when either element is removed
 * during an asynchronous layout pass, and teardown is an expected terminal
 * state rather than an error.
 */
export declare function positionFloatingPanel(reference: ReferenceElement, floating: HTMLElement, placement: Placement): Promise<void>;
export {};
