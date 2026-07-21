import { type ClassValue, clsx, twMerge } from 'cnfast';
import {
	computePosition,
	offset,
	flip,
	shift,
	size,
	type Placement,
	type ReferenceElement
} from '@floating-ui/dom';
import type { Snippet } from 'svelte';

export type DefaultProps = {
	class?: string;
	children?: Snippet;
} & Partial<Record<`data-${string}`, string | boolean | null>>;

/** Merges class values and resolves Tailwind conflicts via cnfast. Sivir uses
 * the `cn(className,
 * extraClasses)` convention -- consumer's `className` first, library-side
 * classes after. `.reverse()` flips into twMerge so the first argument wins
 * on conflicts (consumer overrides always take precedence). */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs.reverse()));
}

/** Shared document body scroll lock. Modal/Sheet and Popover both use this so
 * nested overlays cannot clear each other's lock on teardown. */
let bodyScrollLocks = 0;
let savedBodyOverflow = '';
let savedBodyPaddingRight = '';
let bodyInertLocks = 0;

function isFloatingOverlayElement(el: Element) {
	// Popover wrappers, modal/sheet portals, and any labeled overlay root.
	if (
		el.hasAttribute('data-floating-content') ||
		el.hasAttribute('data-overlay-root') ||
		el.getAttribute('data-ui') === 'modal-overlay' ||
		el.getAttribute('data-ui') === 'sheet-overlay'
	) {
		return true;
	}
	// Modal/Sheet portal wrappers don't always carry an id on the outer node.
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

/** Lock document scrolling. Returns a disposer; only the last active lock restores. */
export function lockBodyScroll() {
	if (typeof document === 'undefined') return () => {};

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

/** Mark non-overlay body children as non-interactive while a floating layer is open. */
export function lockBodyBackground() {
	if (typeof document === 'undefined') return () => {};

	if (bodyInertLocks === 0) {
		for (const el of Array.from(document.body.children) as HTMLElement[]) {
			if (isFloatingOverlayElement(el)) continue;
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

/**
 * Escape closes only the topmost registered layer (submenu cone peels one level
 * at a time). Modal/Sheet/Popover push while open and pop on teardown.
 */
type EscapeLayer = {
	close: () => void;
	element?: Element;
};

const escapeStack: EscapeLayer[] = [];
let escapeListenerAttached = false;

function domDepth(element: Element | undefined) {
	if (!element || !document.contains(element)) return -1;

	let depth = 0;
	let current: Node | null = element;
	while (current) {
		depth += 1;
		current = current.parentNode;
	}
	return depth;
}

function onDocumentEscape(event: KeyboardEvent) {
	if (event.key !== 'Escape' || escapeStack.length === 0) return;
	event.preventDefault();
	// Stop other document Escape handlers from also firing in the same tick.
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
	if (typeof document === 'undefined' || escapeListenerAttached) return;
	document.addEventListener('keydown', onDocumentEscape, true);
	escapeListenerAttached = true;
}

/** Register a close handler while a layer is open. Returns a disposer. */
export function pushEscapeLayer(close: () => void, element?: Element) {
	if (typeof document === 'undefined') return () => {};
	ensureEscapeListener();
	const layer = { close, element };
	escapeStack.push(layer);
	return () => {
		const index = escapeStack.lastIndexOf(layer);
		if (index >= 0) escapeStack.splice(index, 1);
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
		if (el.hasAttribute('disabled')) return false;
		if (el.getAttribute('aria-hidden') === 'true') return false;
		return !(
			el.offsetParent === null &&
			getComputedStyle(el).position !== 'fixed' &&
			getComputedStyle(el).position !== 'sticky'
		);
	});
}

/** Focuses the first focusable descendant when one exists. */
export function focusFirstDescendant(container: HTMLElement) {
	const first = getFocusableElements(container)[0];
	first?.focus();
	return first;
}

/** Keeps keyboard focus inside a container and restores the previous focus on cleanup. */
export function trapFocus(
	dialogEl: HTMLElement,
	options?: { initialFocus?: HTMLElement | null; returnFocus?: HTMLElement | null }
) {
	if (!dialogEl) return;

	const previouslyFocused =
		options?.returnFocus ??
		(document.activeElement instanceof HTMLElement ? document.activeElement : null);

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key !== 'Tab') return;

		const focusable = getFocusableElements(dialogEl);

		if (focusable.length === 0) return;

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
		if (!target || dialogEl.contains(target)) return;
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

/** Constant-pixel press scale. Sets `--sivir-press-sx/sy` from element size + `--motion-press-px`. */
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
		if (e.key === ' ' || e.key === 'Enter') measure();
	}

	// Capture so vars are ready before :active paints.
	node.addEventListener('pointerdown', measure, true);
	node.addEventListener('keydown', onKeyDown);
	return {
		destroy() {
			node.removeEventListener('pointerdown', measure, true);
			node.removeEventListener('keydown', onKeyDown);
		}
	};
}

/** Runs a callback when a pointer event lands outside the node and any excluded nodes. */
export function clickOutside(node: Node, callback: () => void, exclude: Node[] = []) {
	let destroyed = false;
	const handleClick = (event: MouseEvent) => {
		const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
		const target = event.target as Node | null;
		const isInsideNode = path.includes(node) || (target ? node.contains(target) : false);
		const isInsideExcluded = exclude.some(
			(excludeNode) => path.includes(excludeNode) || (target ? excludeNode.contains(target) : false)
		);
		// Floating layers (Select, DropdownMenu, etc.) portal to <body> and carry
		// `data-floating-content`. Clicking one of their items closes that layer,
		// and Svelte flushes the removal synchronously *before* this document-level
		// listener runs -- so the now-detached node drops out of composedPath().
		// Fall back to the target's own ancestor chain, which stays intact after
		// the wrapper is detached, so a parent overlay (Modal/Sheet) isn't dismissed.
		const targetEl = target instanceof Element ? target : null;
		const isInsideFloating =
			path.some((el) => el instanceof Element && el.hasAttribute('data-floating-content')) ||
			targetEl?.closest('[data-floating-content]') != null;

		if (!isInsideNode && !isInsideExcluded && !isInsideFloating) {
			callback();
		}
	};

	const installTimeout = setTimeout(() => {
		if (!destroyed) document.addEventListener('click', handleClick);
	}, 0);

	return {
		destroy() {
			destroyed = true;
			clearTimeout(installTimeout);
			document.removeEventListener('click', handleClick);
		}
	};
}

/** Positions a floating panel while keeping it inside the viewport bounds. */
export function positionFloatingPanel(
	reference: ReferenceElement,
	floating: HTMLElement,
	placement: Placement
) {
	return computePosition(reference, floating, {
		strategy: 'fixed',
		placement,
		middleware: [
			offset(8),
			flip({ padding: 8 }),
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
		.then(({ x, y }) => {
			Object.assign(floating.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		})
		.catch(() => {
			// Floating UI may reject when either element is removed during an
			// asynchronous layout pass. Teardown is an expected terminal state.
		});
}
