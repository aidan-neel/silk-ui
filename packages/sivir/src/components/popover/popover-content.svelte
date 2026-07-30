<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		clickOutside,
		cn,
		lockBodyBackground,
		lockBodyScroll,
		positionFloatingPanel,
		pushEscapeLayer,
		trapFocus
	} from '@sivir/ui/utils';
	import { panelIn, panelOut } from '@sivir/ui/transition';
	import type { PopoverContentProps } from '.';
	import { getPopoverContext } from './context.svelte';

	const {
		children,
		class: classProp,
		surfaceClass,
		allowClickOutside = true,
		portal = true,
		refElement,
		role = 'dialog',
		tabindex = -1,
		focusTrap = true,
		lockScroll = true,
		id,
		'aria-modal': ariaModalProp,
		...rest
	}: PopoverContentProps = $props();

	const { id: key, state: popoverState } = getPopoverContext();

	let popover = $state<HTMLElement | undefined>();
	let panelEl = $state<HTMLElement | undefined>();
	let clickOutsideCleanup: (() => void) | undefined;
	let positionFrame: number | undefined;
	let mounted = false;

	function updatePosition() {
		if (!popover) return;
		const reference = refElement ?? popoverState.buttonRef;
		if (!reference) return;

		const triggerWidth = popoverState.buttonRef?.getBoundingClientRect().width;
		if (triggerWidth) {
			popover.style.setProperty('--popover-trigger-width', `${triggerWidth}px`);
		}

		positionFloatingPanel(reference, popover, refElement ? 'right-start' : popoverState.placement);
	}

	function schedulePosition() {
		if (positionFrame !== undefined) return;
		positionFrame = requestAnimationFrame(() => {
			positionFrame = undefined;
			updatePosition();
		});
	}

	onMount(() => {
		mounted = true;
		document.addEventListener('scroll', schedulePosition);

		window.addEventListener('resize', schedulePosition);
		window.addEventListener('scroll', schedulePosition, true);
		window.visualViewport?.addEventListener('resize', schedulePosition);
		window.visualViewport?.addEventListener('scroll', schedulePosition);

		popoverState.popoverRef = popover;

		if (portal && document && popover) {
			document.body.appendChild(popover);
		}

		if (allowClickOutside && popover) {
			const outside = clickOutside(
				popover,
				() => {
					popoverState.open = false;
				},
				popoverState.buttonRef ? [popoverState.buttonRef] : []
			);
			clickOutsideCleanup = outside.destroy;
		}

		const ro = new ResizeObserver(schedulePosition);
		if (popoverState.buttonRef) ro.observe(popoverState.buttonRef);
		if (popover) ro.observe(popover);

		/**
		 * Focus tracking for the open panel.
		 *
		 * These fire on document focus changes, including the focusout the browser
		 * dispatches synchronously while the content is being removed from the DOM.
		 * The DOM is read synchronously but the state write is deferred to a
		 * microtask, so reactive state is never mutated in the middle of the Svelte
		 * flush that unmounts us -- that throws `state_unsafe_mutation`.
		 */
		const handleFocusIn = (e: FocusEvent) => {
			const target = e.target as HTMLElement;
			if (!target) return;

			const openPopovers = Array.from(
				document.querySelectorAll<HTMLElement>('[data-floating-content]')
			);
			const inside = openPopovers.some((el) => el.contains(target));
			queueMicrotask(() => {
				if (mounted) popoverState.focusedInside = inside;
			});
		};

		const handleFocusOut = () => {
			queueMicrotask(() => {
				if (mounted) popoverState.focusedInside = false;
			});
		};

		document.addEventListener('focusin', handleFocusIn);
		document.addEventListener('focusout', handleFocusOut);

		onDestroy(() => {
			mounted = false;
			document.removeEventListener('scroll', schedulePosition);
			window.removeEventListener('resize', schedulePosition);
			window.removeEventListener('scroll', schedulePosition, true);
			window.visualViewport?.removeEventListener('resize', schedulePosition);
			window.visualViewport?.removeEventListener('scroll', schedulePosition);
			document.removeEventListener('focusin', handleFocusIn);
			document.removeEventListener('focusout', handleFocusOut);
			ro.disconnect();
			if (positionFrame !== undefined) cancelAnimationFrame(positionFrame);
			clickOutsideCleanup?.();
			popoverState.open = false;
			popoverState.popoverRef?.remove();
			popover?.remove();
		});
	});

	function cancelClose() {
		if (popoverState.closeTimeout) {
			if (popoverState.hoverable) {
				clearTimeout(popoverState.closeTimeout);
				popoverState.closeTimeout = undefined;
			}
		}
	}

	/**
	 * Locks body scroll and inerts background siblings whenever the popover is open.
	 *
	 * Hoverable popovers (tooltip, hover-card) skip the lock: `pointer-events-none`
	 * on body children would kill mouseleave/mouseenter on the trigger and cause an
	 * open/close flicker loop. The scroll lock is shared with Modal and Sheet so a
	 * nested teardown cannot clear another layer's lock. This must not gate on
	 * `popover` existing -- a controlled `open=true` has to lock even before the
	 * wrapper finishes binding.
	 */
	$effect(() => {
		if (typeof document === 'undefined') return;
		if (popoverState.open && !popoverState.hoverable && lockScroll) {
			const releaseScroll = lockBodyScroll();
			const releaseBackground = lockBodyBackground();
			return () => {
				releaseBackground();
				releaseScroll();
			};
		}
	});

	/**
	 * Escape peels one layer of the submenu cone. Hoverable layers still register,
	 * so Escape closes the deepest open submenu before the parent menu.
	 */
	$effect(() => {
		if (typeof document === 'undefined') return;
		if (!popoverState.open) return;
		return pushEscapeLayer(() => {
			popoverState.open = false;
		}, popover);
	});

	$effect(() => {
		if (!popoverState.hovering && !popoverState.focusedInside) {
			cancelClose();
		}
	});

	/**
	 * Positions the panel the moment it opens, before the browser paints.
	 *
	 * This sets left/top *and* `--popover-trigger-width` synchronously, so the
	 * panel never flashes at its (0,0) origin -- the cause of the tooltip-swap
	 * jitter -- nor at auto width before snapping to the trigger, which was the
	 * combobox jump. Without it we would rely on the ResizeObserver firing a frame
	 * later.
	 */
	$effect(() => {
		if (popoverState.open && popover) {
			updatePosition();
		}
	});

	/**
	 * Traps Tab focus inside the panel while open. Hoverable surfaces (tooltip,
	 * hover-card) are excluded: they are not keyboard-modal, and stealing focus
	 * would fight their pointer-driven open/close.
	 */
	$effect(() => {
		if (popoverState.open && panelEl && !popoverState.hoverable && focusTrap) {
			const cleanup = trapFocus(panelEl);
			return cleanup;
		}
	});
</script>

<div
	role="presentation"
	data-floating-content
	class={cn(
		'fixed left-0 top-0 z-[130] flex max-w-[calc(100vw-2*var(--popover-viewport-margin))] max-h-[calc(100vh-2*var(--popover-viewport-margin))] items-center justify-center'
	)}
	bind:this={popover as HTMLElement}
	onmouseenter={cancelClose}
	onmouseleave={() => {
		if (popoverState.hoverable) {
			if (popover && popover.contains(document.activeElement)) {
				return;
			}
			popoverState.open = false;
		}
	}}
>
	{#if popoverState.open}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			{...rest}
			in:panelIn
			out:panelOut
			bind:this={panelEl}
			id={id ?? `popover-${String(key)}-content`}
			{role}
			aria-modal={ariaModalProp ??
				(role === 'dialog' || role === 'alertdialog' ? 'true' : undefined)}
			aria-labelledby={rest['aria-label']
				? undefined
				: role === 'dialog' || role === 'alertdialog'
					? `popover-${String(key)}-title`
					: undefined}
			{tabindex}
			data-ui="popover-content"
			class={cn(
				classProp,
				'm-auto flex origin-top-left flex-col overflow-hidden text-sm text-[var(--color-foreground)]',
				'bg-panel shadow-[var(--elevation-float)]',
				'max-w-[min(var(--popover-available-width,calc(100vw-2*var(--popover-viewport-margin))),calc(100vw-2*var(--popover-viewport-margin)))] max-h-[min(var(--popover-available-height,calc(100vh-2*var(--popover-viewport-margin))),calc(100vh-2*var(--popover-viewport-margin)))]',
				'rounded-[var(--radius-lg)] border border-border'
			)}
		>
			<!-- The inset surface: children live here, on the panel fill. -->
			<div class={cn(surfaceClass, 'min-h-0 flex-1 overflow-auto bg-panel p-3')}>
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>
