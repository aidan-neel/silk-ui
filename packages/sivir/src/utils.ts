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

let bodyScrollLocks = 0;
let savedBodyOverflow = '';
let savedBodyPaddingRight = '';
let bodyInertLocks = 0;

/**
 * Whether an element is (or contains) a floating overlay root.
 *
 * Modal and sheet portal wrappers do not always carry an id on the outer node,
 * so this checks the marker attributes, then a descendant query, then the id
 * prefixes each overlay assigns.
 */
function isFloatingOverlayElement(el: Element) {
    if (
        el.hasAttribute('data-floating-content') ||
        el.hasAttribute('data-overlay-root') ||
        el.getAttribute('data-ui') === 'modal-overlay' ||
        el.getAttribute('data-ui') === 'sheet-overlay'
    ) {
        return true;
    }
    if (
        el.querySelector?.(
            '[data-floating-content], [data-overlay-root], [role="dialog"], [role="alertdialog"], [data-ui="modal-overlay"], [data-ui="sheet-overlay"]'
        )
    ) {
        return true;
    }
    const id = el.id;
    return (
        id.startsWith('popover-') ||
        id.startsWith('modal-') ||
        id.startsWith('dialog-') ||
        id.startsWith('sheet-') ||
        id.startsWith('command-') ||
        id.startsWith('alert-dialog-')
    );
}

/**
 * Locks document scrolling and returns a disposer.
 *
 * The lock is refcounted and shared by modal, sheet, and popover so nested
 * overlays cannot clear each other's lock on teardown -- only the last active
 * lock restores the original overflow and scrollbar padding.
 */
export function lockBodyScroll() {
    if (typeof document === 'undefined') {
        return () => {};
    }

    if (bodyScrollLocks === 0) {
        savedBodyOverflow = document.body.style.overflow;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            savedBodyPaddingRight = document.body.style.paddingRight;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.style.overflow = 'hidden';
    }
    bodyScrollLocks += 1;

    return () => {
        bodyScrollLocks = Math.max(0, bodyScrollLocks - 1);
        if (bodyScrollLocks === 0) {
            document.body.style.overflow = savedBodyOverflow;
            document.body.style.paddingRight = savedBodyPaddingRight;
            savedBodyOverflow = '';
            savedBodyPaddingRight = '';
        }
    };
}

/** Marks non-overlay body children as non-interactive while a floating layer is open. */
export function lockBodyBackground() {
    if (typeof document === 'undefined') {
        return () => {};
    }

    if (bodyInertLocks === 0) {
        for (const el of Array.from(document.body.children) as HTMLElement[]) {
            if (isFloatingOverlayElement(el)) {
                continue;
            }
            el.classList.add('pointer-events-none');
        }
    }
    bodyInertLocks += 1;

    return () => {
        bodyInertLocks = Math.max(0, bodyInertLocks - 1);
        if (bodyInertLocks === 0) {
            for (const el of Array.from(document.body.children) as HTMLElement[]) {
                el.classList.remove('pointer-events-none');
            }
        }
    };
}

/** Test isolation for the process-local body locks. */
export function resetBodyLocksForTests() {
    bodyScrollLocks = 0;
    bodyInertLocks = 0;
    savedBodyOverflow = '';
    savedBodyPaddingRight = '';
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        for (const el of Array.from(document.body.children) as HTMLElement[]) {
            el.classList.remove('pointer-events-none');
        }
    }
}

type EscapeLayer = {
    close: () => void;
    element?: Element;
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
    let topDepth = domDepth(escapeStack[topIndex]?.element);
    for (let index = escapeStack.length - 2; index >= 0; index -= 1) {
        const depth = domDepth(escapeStack[index]?.element);
        if (depth > topDepth) {
            topIndex = index;
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
export function pushEscapeLayer(close: () => void, element?: Element) {
    if (typeof document === 'undefined') {
        return () => {};
    }
    ensureEscapeListener();
    const layer = { close, element };
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

        const focusable = getFocusableElements(dialogEl);

        if (focusable.length === 0) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
            if (!active || !dialogEl.contains(active) || active === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (!active || !dialogEl.contains(active) || active === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as Node | null;
        if (!target || dialogEl.contains(target)) {
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
        previouslyFocused?.focus();
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
    const itemSelector = options.itemSelector ?? '[data-collection-item]';
    const restingSelector =
        options.restingSelector ??
        `${itemSelector}[data-collection-active="true"], ${itemSelector}[aria-selected="true"], ${itemSelector}[data-state="open"]`;
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
        if (!ready) {
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
        const item = usableItem(event.target);
        if (item && item !== current) {
            schedule(item);
        }
    }

    function onPointerOver(event: PointerEvent) {
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

    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerover', onPointerOver);
    node.addEventListener('pointerleave', onPointerLeave);
    node.addEventListener('focusin', onFocusIn);
    node.addEventListener('focusout', onFocusOut);
    queueMicrotask(() => schedule(restingTarget()));

    return {
        destroy() {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(readyFrame);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            node.removeEventListener('pointermove', onPointerMove);
            node.removeEventListener('pointerover', onPointerOver);
            node.removeEventListener('pointerleave', onPointerLeave);
            node.removeEventListener('focusin', onFocusIn);
            node.removeEventListener('focusout', onFocusOut);
            highlight.remove();
            node.classList.remove('sivir-collection-surface');
        }
    };
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
        return !isInsideNode && !isInsideExcluded && !isInsideFloating;
    }

    function dismiss(event: Event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        callback();
    }

    const handlePointerDown = (event: PointerEvent) => {
        if (isOutside(event)) {
            dismissedByPointer = true;
            dismiss(event);
        }
    };

    const handleClick = (event: MouseEvent) => {
        if (dismissedByPointer) {
            dismissedByPointer = false;
            dismiss(event);
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
    placement: Placement
) {
    floating.dataset.placement ??= placement;
    return computePosition(reference, floating, {
        strategy: 'fixed',
        placement,
        middleware: [
            offset(8),
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
