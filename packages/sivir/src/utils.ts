import {
    computePosition,
    flip,
    offset,
    type Placement,
    type ReferenceElement,
    shift,
    size
} from '@floating-ui/dom';
import { type ClassValue, clsx, twMerge } from 'cnfast';
import { getContext, hasContext, type Snippet, setContext } from 'svelte';

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
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs.reverse()));
}

/** Keeps fixed overlays within the browser's visual viewport, including above an on-screen keyboard. */
export function visualViewportBounds(node: HTMLElement) {
    const update = () => {
        const viewport = window.visualViewport;
        const top = viewport?.offsetTop ?? 0;
        const height = viewport?.height ?? window.innerHeight;

        node.style.setProperty('--sivir-viewport-top', `${top}px`);
        node.style.setProperty('--sivir-viewport-height', `${height}px`);
        node.style.setProperty('--sivir-viewport-center', `${top + height / 2}px`);
    };

    update();
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return {
        destroy() {
            window.visualViewport?.removeEventListener('resize', update);
            window.visualViewport?.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        }
    };
}

/**
 * Builds a typed Svelte context pair for one component family.
 *
 * `name` is the kebab-case component name; it becomes both the context key
 * and the PascalCase name in the "used outside its root" error, so
 * `createContext('context-menu')` reports `<ContextMenu.Root>`.
 */
export function createContext<T>(name: string) {
    const key = Symbol(`sivir.${name}`);
    const label = name.replace(/(^|-)(\w)/g, (_match, _sep, char: string) => char.toUpperCase());

    return {
        set(value: T) {
            setContext(key, value);
            return value;
        },
        get(): T {
            if (!hasContext(key)) {
                throw new Error(`${label} components must be used within <${label}.Root>.`);
            }
            return getContext<T>(key);
        }
    };
}

/**
 * Closes a menu layer and every ancestor above it (full submenu-cone collapse).
 *
 * Shared by context-menu and dropdown-menu, whose state objects differ but
 * both expose `open`.
 */
export function closeMenuLayers(current: { open: boolean }, ancestors: { open: boolean }[]) {
    current.open = false;

    // Let the selected submenu begin its normal exit before its parents follow.
    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const ancestor = ancestors[index];
        if (!ancestor) {
            continue;
        }

        setTimeout(
            () => {
                ancestor.open = false;
            },
            (ancestors.length - 1 - index) * 16 + 16
        );
    }
}

function pointInTriangle(
    point: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number },
    c: { x: number; y: number }
) {
    const sign = (p1: typeof point, p2: typeof point, p3: typeof point) =>
        (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    const first = sign(point, a, b);
    const second = sign(point, b, c);
    const third = sign(point, c, a);
    const hasNegative = first < 0 || second < 0 || third < 0;
    const hasPositive = first > 0 || second > 0 || third > 0;

    return !(hasNegative && hasPositive);
}

function pointInRect(point: { x: number; y: number }, rect: DOMRect) {
    return (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
    );
}

/** Whether a pointer is in the contact triangle between a floating trigger and panel. */
export function isPointInSubmenuTriangle(
    point: { x: number; y: number },
    trigger: DOMRect,
    panel: DOMRect,
    placement: Placement
) {
    if (pointInRect(point, trigger) || pointInRect(point, panel)) {
        return true;
    }

    const contactMargin = 8;
    const triggerCenter = {
        x: (trigger.left + trigger.right) / 2,
        y: (trigger.top + trigger.bottom) / 2
    };

    switch (placement.split('-')[0]) {
        case 'left':
            return pointInTriangle(
                point,
                { x: trigger.left - contactMargin, y: triggerCenter.y },
                { x: panel.right + contactMargin, y: panel.top },
                { x: panel.right + contactMargin, y: panel.bottom }
            );
        case 'top':
            return pointInTriangle(
                point,
                { x: triggerCenter.x, y: trigger.top - contactMargin },
                { x: panel.left, y: panel.bottom + contactMargin },
                { x: panel.right, y: panel.bottom + contactMargin }
            );
        case 'bottom':
            return pointInTriangle(
                point,
                { x: triggerCenter.x, y: trigger.bottom + contactMargin },
                { x: panel.left, y: panel.top - contactMargin },
                { x: panel.right, y: panel.top - contactMargin }
            );
        default:
            return pointInTriangle(
                point,
                { x: trigger.right + contactMargin, y: triggerCenter.y },
                { x: panel.left - contactMargin, y: panel.top },
                { x: panel.left - contactMargin, y: panel.bottom }
            );
    }
}

type OverflowLockRecord = {
    count: number;
    overflow: string;
    paddingRight: string;
};

type InertRecord = {
    count: number;
    wasInert: boolean;
};

const overflowLocks = new Map<HTMLElement, OverflowLockRecord>();
const inertRecords = new Map<HTMLElement, InertRecord>();

function isOverlayRoot(element: Element) {
    return (
        element.hasAttribute('data-floating-content') || element.hasAttribute('data-overlay-root')
    );
}

function isInExternalLayer(target: EventTarget | Node | null, container: HTMLElement) {
    const el =
        target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    if (!el) {
        return false;
    }

    const layer = el.closest('[data-floating-content], [data-overlay-root]');
    if (!layer) {
        return false;
    }

    return !container.contains(layer) && !layer.contains(container);
}

function isScrollOverflow(value: string) {
    return value === 'auto' || value === 'scroll' || value === 'overlay';
}

function hasScrollableOverflow(element: HTMLElement) {
    const style = getComputedStyle(element);
    return (
        isScrollOverflow(style.overflowY) ||
        isScrollOverflow(style.overflowX) ||
        isScrollOverflow(element.style.overflowY) ||
        isScrollOverflow(element.style.overflowX) ||
        isScrollOverflow(element.style.overflow)
    );
}

function retainOverflowLock(
    element: HTMLElement,
    extra?: {
        paddingRight?: string;
    }
) {
    const record = overflowLocks.get(element);
    if (record) {
        record.count += 1;
        return;
    }

    overflowLocks.set(element, {
        count: 1,
        overflow: element.style.overflow,
        paddingRight: element.style.paddingRight
    });
    if (extra?.paddingRight) {
        element.style.paddingRight = extra.paddingRight;
    }
    element.style.overflow = 'hidden';
}

function releaseOverflowLock(element: HTMLElement) {
    const record = overflowLocks.get(element);
    if (!record) {
        return;
    }
    record.count -= 1;
    if (record.count > 0) {
        return;
    }

    element.style.overflow = record.overflow;
    element.style.paddingRight = record.paddingRight;
    overflowLocks.delete(element);
}

function retainInert(element: HTMLElement) {
    const record = inertRecords.get(element);
    if (record) {
        record.count += 1;
        return;
    }

    inertRecords.set(element, {
        count: 1,
        wasInert: element.inert === true
    });
    element.inert = true;
}

function releaseInert(element: HTMLElement) {
    const record = inertRecords.get(element);
    if (!record) {
        return;
    }
    record.count -= 1;
    if (record.count > 0) {
        return;
    }

    element.inert = record.wasInert;
    inertRecords.delete(element);
}

/**
 * Inerts document branches outside the given roots.
 *
 * Ancestors of each root stay active so a popover trigger can still dismiss,
 * while sibling branches, other overlay roots, and nodes added later are
 * excluded from pointer and keyboard interaction.
 */
export function inertOutside(activeRoots: HTMLElement[]) {
    if (typeof document === 'undefined') {
        return () => {};
    }

    const retained = new Set<HTMLElement>();

    const retainIfOutside = (element: HTMLElement) => {
        if (
            retained.has(element) ||
            element.closest('[data-floating-content], [data-overlay-root]') ||
            activeRoots.some((root) => {
                return element === root || element.contains(root) || root.contains(element);
            })
        ) {
            return;
        }

        retained.add(element);
        retainInert(element);
    };

    for (const root of activeRoots) {
        let branch = root;
        while (branch.parentElement) {
            const parent = branch.parentElement;
            for (const sibling of parent.children) {
                if (sibling instanceof HTMLElement && sibling !== branch) {
                    retainIfOutside(sibling);
                }
            }
            if (parent === document.body) {
                break;
            }
            branch = parent;
        }
    }

    const observer = new MutationObserver((records) => {
        for (const record of records) {
            for (const node of record.addedNodes) {
                if (node instanceof HTMLElement) {
                    retainIfOutside(node);
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return () => {
        observer.disconnect();
        for (const element of retained) {
            releaseInert(element);
        }
    };
}

/**
 * Locks document scrolling and returns a disposer.
 *
 * The lock is refcounted and shared by modal, sheet, and popover so nested
 * overlays cannot clear each other's lock on teardown -- only the last active
 * lock restores the original overflow and scrollbar padding. Overlay roots keep
 * their own overflow so dialog surfaces can still scroll.
 */
export function lockBodyScroll() {
    if (typeof document === 'undefined') {
        return () => {};
    }

    const locked: HTMLElement[] = [];
    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    retainOverflowLock(html);
    locked.push(html);
    retainOverflowLock(
        body,
        scrollbarWidth > 0
            ? {
                  paddingRight: `${scrollbarWidth}px`
              }
            : undefined
    );
    locked.push(body);

    const walk = (parent: Element) => {
        for (const child of parent.children) {
            if (!(child instanceof HTMLElement)) {
                continue;
            }
            if (isOverlayRoot(child)) {
                continue;
            }
            if (hasScrollableOverflow(child)) {
                retainOverflowLock(child);
                locked.push(child);
            }
            walk(child);
        }
    };
    walk(body);

    return () => {
        for (const element of locked) {
            releaseOverflowLock(element);
        }
    };
}

/**
 * Marks non-overlay body children as non-interactive while a floating layer is
 * open. Overlay roots already portaled onto `document.body` stay active.
 */
export function lockBodyBackground() {
    if (typeof document === 'undefined') {
        return () => {};
    }

    const roots: HTMLElement[] = [];
    for (const child of document.body.children) {
        if (child instanceof HTMLElement && isOverlayRoot(child)) {
            roots.push(child);
        }
    }
    return inertOutside(roots);
}

/** Test isolation for the process-local body locks. */
export function resetBodyLocksForTests() {
    if (typeof document === 'undefined') {
        overflowLocks.clear();
        inertRecords.clear();
        return;
    }

    for (const element of Array.from(overflowLocks.keys())) {
        const record = overflowLocks.get(element);
        if (!record) {
            continue;
        }
        element.style.overflow = record.overflow;
        element.style.paddingRight = record.paddingRight;
    }
    overflowLocks.clear();

    for (const element of Array.from(inertRecords.keys())) {
        const record = inertRecords.get(element);
        if (!record) {
            continue;
        }
        element.inert = record.wasInert;
    }
    inertRecords.clear();

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    for (const el of Array.from(document.body.children) as HTMLElement[]) {
        el.classList.remove('pointer-events-none');
    }
}

type EscapeLayer = {
    close: () => void;
    element?: Element;
    rank: number;
};

const escapeStack: EscapeLayer[] = [];
let escapeListenerAttached = false;

/** DOM depth of an element, or -1 when it is detached. */
function domDepth(element: Element | undefined) {
    if (!element || !document.contains(element)) {
        return -1;
    }

    let depth = 0;
    let current: Node | null = element;
    while (current) {
        depth += 1;
        current = current.parentNode;
    }
    return depth;
}

/**
 * Closes the topmost registered layer only, so a submenu cone peels one level
 * per keypress. `stopImmediatePropagation` keeps other document-level Escape
 * handlers from firing in the same tick and closing a second layer.
 */
function onDocumentEscape(event: KeyboardEvent) {
    if (event.key !== 'Escape' || escapeStack.length === 0) {
        return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();

    let topIndex = escapeStack.length - 1;
    let topRank = escapeStack[topIndex]?.rank ?? 0;
    let topDepth = domDepth(escapeStack[topIndex]?.element);
    for (let index = escapeStack.length - 2; index >= 0; index -= 1) {
        const rank = escapeStack[index]?.rank ?? 0;
        const depth = domDepth(escapeStack[index]?.element);
        if (rank > topRank || (rank === topRank && depth > topDepth)) {
            topIndex = index;
            topRank = rank;
            topDepth = depth;
        }
    }

    escapeStack[topIndex]?.close();
}

function ensureEscapeListener() {
    if (typeof document === 'undefined' || escapeListenerAttached) {
        return;
    }
    document.addEventListener('keydown', onDocumentEscape, true);
    escapeListenerAttached = true;
}

/**
 * Registers a close handler while a layer is open and returns a disposer.
 * Modal, sheet, and popover push on open and pop on teardown.
 */
export function pushEscapeLayer(close: () => void, element?: Element, rank = 0) {
    if (typeof document === 'undefined') {
        return () => {};
    }
    ensureEscapeListener();
    const layer = {
        close,
        element,
        rank
    };
    escapeStack.push(layer);
    return () => {
        const index = escapeStack.lastIndexOf(layer);
        if (index >= 0) {
            escapeStack.splice(index, 1);
        }
    };
}

/** Test isolation for the escape stack. */
export function resetEscapeStackForTests() {
    escapeStack.length = 0;
}

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

/** Returns the visible, interactive descendants inside a container. */
export function getFocusableElements(container: HTMLElement) {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
        if (el.hasAttribute('disabled')) {
            return false;
        }
        if (el.getAttribute('aria-hidden') === 'true') {
            return false;
        }
        return !(
            el.offsetParent === null &&
            getComputedStyle(el).position !== 'fixed' &&
            getComputedStyle(el).position !== 'sticky'
        );
    });
}

/** Focuses the first focusable descendant when one exists. */
function focusFirstDescendant(container: HTMLElement) {
    const first = getFocusableElements(container)[0];
    first?.focus();
    return first;
}

/** Keeps keyboard focus inside a container and restores the previous focus on cleanup. */
export function trapFocus(
    dialogEl: HTMLElement,
    options?: { initialFocus?: HTMLElement | null; returnFocus?: HTMLElement | null }
) {
    if (!dialogEl) {
        return;
    }

    const previouslyFocused =
        options?.returnFocus ??
        (document.activeElement instanceof HTMLElement ? document.activeElement : null);

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') {
            return;
        }

        const active = document.activeElement as HTMLElement | null;
        if (isInExternalLayer(active, dialogEl)) {
            return;
        }

        const focusable = getFocusableElements(dialogEl);

        if (focusable.length === 0) {
            e.preventDefault();
            dialogEl.focus();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const focusIsOutside = !active || !dialogEl.contains(active);
        const focusIsOnContainer = active === dialogEl;

        if (e.shiftKey) {
            if (focusIsOutside || focusIsOnContainer || active === first) {
                e.preventDefault();
                last.focus();
            }
        } else if (focusIsOutside || focusIsOnContainer || active === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as Node | null;
        if (!target || dialogEl.contains(target) || isInExternalLayer(target, dialogEl)) {
            return;
        }
        if (options?.initialFocus) {
            options.initialFocus.focus();
        } else if (!focusFirstDescendant(dialogEl)) {
            dialogEl.focus();
        }
    };

    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('focusin', handleFocusIn, true);

    queueMicrotask(() => {
        if (options?.initialFocus) {
            options.initialFocus.focus();
        } else if (!focusFirstDescendant(dialogEl)) {
            dialogEl.focus();
        }
    });

    return () => {
        document.removeEventListener('keydown', handleKeydown, true);
        document.removeEventListener('focusin', handleFocusIn, true);
        const restore = previouslyFocused;
        queueMicrotask(() => {
            if (!restore?.isConnected) {
                return;
            }
            restore.focus();
        });
    };
}

const PRESS_FLOOR = 0.94;

/**
 * Constant-pixel press scale.
 *
 * Sets `--sivir-press-sx/sy` from the element's size and `--motion-press-px` so
 * a small and a large control shrink by the same number of pixels rather than
 * the same ratio. Listens in the capture phase so the variables are in place
 * before `:active` paints.
 */
export function pressable(node: HTMLElement) {
    function measure() {
        const raw = getComputedStyle(node).getPropertyValue('--motion-press-px').trim();
        const px = Number.parseFloat(raw) || 2;
        const { width, height } = node.getBoundingClientRect();
        const sx = width > 0 ? Math.max((width - px) / width, PRESS_FLOOR) : 0.98;
        const sy = height > 0 ? Math.max((height - px) / height, PRESS_FLOOR) : 0.98;
        node.style.setProperty('--sivir-press-sx', sx.toFixed(4));
        node.style.setProperty('--sivir-press-sy', sy.toFixed(4));
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === ' ' || e.key === 'Enter') {
            measure();
        }
    }

    node.addEventListener('pointerdown', measure, true);
    node.addEventListener('keydown', onKeyDown);
    return {
        destroy() {
            node.removeEventListener('pointerdown', measure, true);
            node.removeEventListener('keydown', onKeyDown);
        }
    };
}

type TravelingHighlightOptions = {
    itemSelector?: string;
    restingSelector?: string;
};

/**
 * Draws one highlight that travels between the active items in a collection.
 * Geometry is written directly so pointer movement never causes a component render.
 */
export function travelingHighlight(node: HTMLElement, options: TravelingHighlightOptions = {}) {
    if (typeof window === 'undefined') {
        return {};
    }
    if (
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(hover: none), (pointer: coarse)').matches
    ) {
        return {};
    }
    const traveling =
        getComputedStyle(node).getPropertyValue('--sivir-traveling-highlight').trim() !== 'none';
    const itemSelector = options.itemSelector ?? '[data-collection-item]';
    const restingSelector =
        options.restingSelector ??
        `${itemSelector}[data-collection-active="true"], ${itemSelector}[aria-selected="true"], ${itemSelector}[data-state="open"]`;
    const coarsePointer =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const highlight = document.createElement('span');
    highlight.className = 'sivir-item-highlight';
    highlight.setAttribute('aria-hidden', 'true');
    node.classList.add('sivir-collection-surface');
    node.prepend(highlight);

    let current: HTMLElement | undefined;
    let frame = 0;
    let readyFrame = 0;
    let ready = false;
    let observedTarget: HTMLElement | undefined;
    const resizeObserver = new ResizeObserver(() => schedule(current ?? restingTarget()));
    resizeObserver.observe(node);

    function usableItem(target: EventTarget | null) {
        if (!(target instanceof Element)) {
            return;
        }
        const item = target.closest<HTMLElement>(itemSelector);
        if (!item || !node.contains(item)) {
            return;
        }
        if (item.closest('.sivir-collection-surface') !== node) {
            return;
        }
        if (item.matches(':disabled, [aria-disabled="true"]') || item.hidden) {
            return;
        }
        return item;
    }

    function restingTarget() {
        for (const selector of restingSelector.split(',').map((part) => part.trim())) {
            const target = Array.from(node.querySelectorAll<HTMLElement>(selector)).find(
                (item) => item.closest('.sivir-collection-surface') === node
            );
            if (target) {
                return target;
            }
        }
        return undefined;
    }

    function measure(target: HTMLElement | undefined) {
        cancelAnimationFrame(frame);
        current = target;
        if (!target?.isConnected || target.hidden) {
            if (observedTarget) {
                resizeObserver.unobserve(observedTarget);
                observedTarget = undefined;
            }
            highlight.style.opacity = '0';
            return;
        }

        const container = node.getBoundingClientRect();
        const rect = target.getBoundingClientRect();
        const x = rect.left - container.left - node.clientLeft + node.scrollLeft;
        const y = rect.top - container.top - node.clientTop + node.scrollTop;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        highlight.style.opacity = '1';

        if (observedTarget !== target) {
            if (observedTarget) {
                resizeObserver.unobserve(observedTarget);
            }
            observedTarget = target;
            resizeObserver.observe(target);
        }
        if (!ready && traveling) {
            cancelAnimationFrame(readyFrame);
            readyFrame = requestAnimationFrame(() => {
                ready = true;
                highlight.setAttribute('data-ready', 'true');
            });
        }
    }

    function schedule(target: HTMLElement | undefined) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => measure(target));
    }

    function onPointerMove(event: PointerEvent) {
        if (event.pointerType === 'touch') {
            return;
        }
        const item = usableItem(event.target);
        if (item && item !== current) {
            schedule(item);
        }
    }

    function onPointerOver(event: PointerEvent) {
        if (event.pointerType === 'touch') {
            return;
        }
        const item = usableItem(event.target);
        if (item && item !== current) {
            schedule(item);
        }
    }

    function onPointerLeave() {
        schedule(restingTarget());
    }

    function onFocusIn(event: FocusEvent) {
        const item = usableItem(event.target);
        if (item) {
            schedule(item);
        }
    }

    function onFocusOut(event: FocusEvent) {
        if (event.relatedTarget instanceof Node && node.contains(event.relatedTarget)) {
            return;
        }
        schedule(restingTarget());
    }

    const mutationObserver = new MutationObserver(() => {
        schedule(restingTarget());
    });
    mutationObserver.observe(node, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: [
            'aria-selected',
            'data-collection-active',
            'data-state',
            'disabled',
            'hidden'
        ]
    });

    if (!coarsePointer) {
        node.addEventListener('pointermove', onPointerMove);
        node.addEventListener('pointerover', onPointerOver);
        node.addEventListener('pointerleave', onPointerLeave);
    }
    node.addEventListener('focusin', onFocusIn);
    node.addEventListener('focusout', onFocusOut);
    queueMicrotask(() => schedule(restingTarget()));

    return {
        destroy() {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(readyFrame);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            if (!coarsePointer) {
                node.removeEventListener('pointermove', onPointerMove);
                node.removeEventListener('pointerover', onPointerOver);
                node.removeEventListener('pointerleave', onPointerLeave);
            }
            node.removeEventListener('focusin', onFocusIn);
            node.removeEventListener('focusout', onFocusOut);
            highlight.remove();
            node.classList.remove('sivir-collection-surface');
        }
    };
}

type DynamicWidthOptions = {
    enabled?: boolean;
    itemSelector?: string;
    buffer?: number;
};

/**
 * Sizes a menu panel to its largest item plus a buffer.
 *
 * Measures every visible item at its intrinsic width and writes the maximum
 * plus `buffer` pixels to the closest popover panel, re-measuring as items
 * mount, change, or resize. Writes are skipped when the width is unchanged.
 */
export function dynamicWidth(node: HTMLElement, options: DynamicWidthOptions = {}) {
    if (typeof window === 'undefined') {
        return {};
    }
    let enabled = options.enabled ?? true;
    let itemSelector = options.itemSelector ?? '[data-collection-item]';
    let buffer = options.buffer ?? 16;

    let frame = 0;
    let applied = '';
    const observed = new Set<HTMLElement>();
    const resizeObserver =
        typeof ResizeObserver === 'function' ? new ResizeObserver(() => schedule()) : undefined;
    const mutationObserver =
        typeof MutationObserver === 'function' ? new MutationObserver(() => schedule()) : undefined;

    function panel() {
        return node.closest<HTMLElement>('[data-ui="popover-content"]') ?? node;
    }

    function collect() {
        return Array.from(node.querySelectorAll<HTMLElement>(itemSelector)).filter((item) => {
            const surface = item.closest('.sivir-collection-surface');
            if (surface && surface !== node) {
                return false;
            }
            return !item.hidden && item.getClientRects().length > 0;
        });
    }

    function syncItemObservers(items: HTMLElement[]) {
        if (!resizeObserver) {
            return;
        }
        for (const item of observed) {
            if (!items.includes(item)) {
                resizeObserver.unobserve(item);
                observed.delete(item);
            }
        }
        for (const item of items) {
            if (!observed.has(item)) {
                observed.add(item);
                resizeObserver.observe(item);
            }
        }
    }

    function measure() {
        frame = 0;
        const target = panel();
        const items = enabled ? collect() : [];
        syncItemObservers(items);
        if (items.length === 0) {
            if (applied) {
                target.style.removeProperty('width');
                applied = '';
            }
            return;
        }

        const previous = new Map<HTMLElement, string>();
        try {
            for (const item of items) {
                previous.set(item, item.style.width);
                item.style.width = 'max-content';
            }
            let max = 0;
            for (const item of items) {
                max = Math.max(max, item.offsetWidth);
            }
            const width = `${Math.ceil(max + buffer)}px`;
            if (width !== applied) {
                target.style.width = width;
                applied = width;
            }
        } finally {
            for (const item of items) {
                item.style.width = previous.get(item) ?? '';
            }
        }
    }

    function schedule() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measure);
    }

    function settle() {
        queueMicrotask(() => {
            schedule();
            requestAnimationFrame(() => {
                schedule();
                requestAnimationFrame(() => schedule());
            });
        });
    }

    mutationObserver?.observe(node, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['hidden']
    });
    settle();

    return {
        update(next: DynamicWidthOptions = {}) {
            const wasEnabled = enabled;
            enabled = next.enabled ?? true;
            itemSelector = next.itemSelector ?? '[data-collection-item]';
            buffer = next.buffer ?? 16;
            if (enabled && !wasEnabled) {
                settle();
            } else {
                schedule();
            }
        },
        destroy() {
            cancelAnimationFrame(frame);
            mutationObserver?.disconnect();
            resizeObserver?.disconnect();
            observed.clear();
            if (applied) {
                panel().style.removeProperty('width');
                applied = '';
            }
        }
    };
}

function overlayRootOf(node: Node | null) {
    if (node instanceof Element) {
        return node.closest('[data-overlay-root]');
    }
    return node?.parentElement?.closest('[data-overlay-root]') ?? null;
}

let overlayPointerGesture = false;
let overlayPointerGestureTimeout: ReturnType<typeof setTimeout> | undefined;

function markOverlayPointerGesture() {
    overlayPointerGesture = true;
    if (overlayPointerGestureTimeout !== undefined) {
        clearTimeout(overlayPointerGestureTimeout);
    }
    overlayPointerGestureTimeout = setTimeout(() => {
        overlayPointerGesture = false;
        overlayPointerGestureTimeout = undefined;
    }, 0);
}

/** Test isolation for the overlay click-outside gesture lock. */
export function resetClickOutsideForTests() {
    overlayPointerGesture = false;
    if (overlayPointerGestureTimeout !== undefined) {
        clearTimeout(overlayPointerGestureTimeout);
        overlayPointerGestureTimeout = undefined;
    }
}

function overlayRootFromEvent(event: Event, path: EventTarget[]) {
    for (const entry of path) {
        if (entry instanceof Element && entry.hasAttribute('data-overlay-root')) {
            return entry;
        }
    }
    const target = event.target;
    if (target instanceof Element) {
        return target.closest('[data-overlay-root]');
    }
    return null;
}

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
 *
 * Nested overlays portal as sibling `[data-overlay-root]` hosts. A click inside
 * a different overlay root belongs to that layer, so this listener must not
 * treat it as an outside dismiss — otherwise Cancel on a nested modal closes
 * the parent too.
 *
 * Select, Combobox, and Dropdown Menu dismiss on pointerdown. That unmounts
 * their dismiss scrim before the following `click`, which would otherwise hit
 * the parent Modal overlay and close it. One pointer gesture peels one layer.
 */
export function clickOutside(node: Node, callback: () => void, exclude: Node[] = []) {
    let destroyed = false;
    let dismissedByPointer = false;

    function isOutside(event: Event) {
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
        const target = event.target as Node | null;
        const isInsideNode = path.includes(node) || (target ? node.contains(target) : false);
        const isInsideExcluded = exclude.some(
            (excludeNode) =>
                path.includes(excludeNode) || (target ? excludeNode.contains(target) : false)
        );
        const targetEl = target instanceof Element ? target : null;
        const isInsideFloating =
            path.some((el) => el instanceof Element && el.hasAttribute('data-floating-content')) ||
            targetEl?.closest('[data-floating-content]') != null;
        const clickRoot = overlayRootFromEvent(event, path);
        const nodeRoot = overlayRootOf(node);
        const isInsideOtherOverlay =
            clickRoot != null && nodeRoot != null && clickRoot !== nodeRoot;
        return !isInsideNode && !isInsideExcluded && !isInsideFloating && !isInsideOtherOverlay;
    }

    function dismiss(event: Event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        callback();
    }

    const handlePointerDown = (event: PointerEvent) => {
        if (isOutside(event)) {
            dismissedByPointer = true;
            markOverlayPointerGesture();
            dismiss(event);
        }
    };

    const handleClick = (event: MouseEvent) => {
        if (dismissedByPointer) {
            dismissedByPointer = false;
            dismiss(event);
            return;
        }
        if (overlayPointerGesture) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        if (isOutside(event)) {
            dismiss(event);
        }
    };

    const installTimeout = setTimeout(() => {
        if (!destroyed) {
            document.addEventListener('pointerdown', handlePointerDown, true);
            document.addEventListener('click', handleClick, true);
        }
    }, 0);

    return {
        destroy() {
            destroyed = true;
            clearTimeout(installTimeout);
            document.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('click', handleClick, true);
        }
    };
}

export function submenuPanelOffset(placement: Placement, hoverable: boolean) {
    if (!hoverable) {
        return 8;
    }

    const side = placement.split('-')[0];
    if (side === 'left' || side === 'right') {
        return -2;
    }

    return 8;
}

/**
 * Positions a floating panel while keeping it inside the viewport bounds.
 *
 * Rejections are swallowed: Floating UI rejects when either element is removed
 * during an asynchronous layout pass, and teardown is an expected terminal
 * state rather than an error.
 */
export function positionFloatingPanel(
    reference: ReferenceElement,
    floating: HTMLElement,
    placement: Placement,
    offsetPx = 8
) {
    floating.dataset.placement ??= placement;
    return computePosition(reference, floating, {
        strategy: 'fixed',
        placement,
        middleware: [
            offset(offsetPx),
            flip({ padding: 8, fallbackAxisSideDirection: 'end', fallbackStrategy: 'bestFit' }),
            shift({ padding: 8, crossAxis: true }),
            size({
                padding: 8,
                apply({ availableWidth, availableHeight, elements }) {
                    elements.floating.style.maxWidth = `${Math.max(availableWidth, 0)}px`;
                    elements.floating.style.maxHeight = `${Math.max(availableHeight, 0)}px`;
                    elements.floating.style.setProperty(
                        '--popover-available-width',
                        `${Math.max(availableWidth, 0)}px`
                    );
                    elements.floating.style.setProperty(
                        '--popover-available-height',
                        `${Math.max(availableHeight, 0)}px`
                    );
                }
            })
        ]
    })
        .then(({ x, y, placement: resolvedPlacement }) => {
            Object.assign(floating.style, {
                left: `${x}px`,
                top: `${y}px`
            });
            floating.dataset.placement = resolvedPlacement;
        })
        .catch(() => {});
}
