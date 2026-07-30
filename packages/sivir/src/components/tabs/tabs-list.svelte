<!-- token-lint-disable-file -->
<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { getContext, untrack } from 'svelte';
	import type { TabsListProps, TabsState } from '.';

	let { children, class: className, ...rest }: TabsListProps = $props();
	const tabsState = getContext<TabsState>('tabs');

	type Rect = { left: number; top: number; width: number; height: number };

	const variant = $derived(tabsState.variant);
	/**
	 * `default` and `ghost` get the animated hover-highlight pill. The
	 * container-style `segmented` variant does not -- its pill marks the active tab.
	 */
	const showHover = $derived(variant !== 'segmented');

	let listEl = $state<HTMLDivElement | undefined>(undefined);
	let indicator = $state<Rect | null>(null);
	let hover = $state<Rect | null>(null);
	let hovering = $state(false);
	let ready = $state(false);

	/**
	 * Ghost uses a single fill that rests on the selected tab and slides to
	 * whatever tab the pointer is over, snapping back to the selection on
	 * mouse-leave.
	 */
	const ghostRect = $derived(hovering && hover ? hover : indicator);

	function rectOf(el: HTMLElement): Rect {
		return {
			left: el.offsetLeft,
			top: el.offsetTop,
			width: el.offsetWidth,
			height: el.offsetHeight
		};
	}

	function measureIndicator() {
		if (!listEl) return;
		const active = listEl.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
		indicator = active ? rectOf(active) : null;
	}

	function handleMouseOver(event: Event) {
		if (!showHover || !listEl) return;
		const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[role="tab"]');
		if (!target || target.hasAttribute('disabled') || !listEl.contains(target)) return;
		hover = rectOf(target);
		hovering = true;
	}

	function handleMouseLeave() {
		hovering = false;
	}

	$effect(() => {
		const _ = tabsState.value;
		untrack(() => {
			queueMicrotask(() => {
				measureIndicator();
				ready = true;
			});
		});
	});

	$effect(() => {
		if (!listEl) return;
		const ro = new ResizeObserver(() => measureIndicator());
		ro.observe(listEl);
		const triggers = listEl.querySelectorAll<HTMLElement>('[role="tab"]');
		triggers.forEach((el) => ro.observe(el));
		window.addEventListener('resize', measureIndicator);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', measureIndicator);
		};
	});

	function moveFocus(current: HTMLElement, direction: 1 | -1) {
		const list = current.closest('[role="tablist"]');
		if (!list) return;
		const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
		const index = tabs.indexOf(current);
		if (index === -1) return;
		const next = tabs[(index + direction + tabs.length) % tabs.length];
		next?.focus();
		next?.click();
	}

	function handleKeydown(event: KeyboardEvent) {
		const target = event.target;
		if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'tab') return;
		const isHorizontal = tabsState.orientation === 'horizontal';
		if (event.key === 'Home') {
			event.preventDefault();
			const first = target
				.closest('[role="tablist"]')
				?.querySelector<HTMLElement>('[role="tab"]:not([disabled])');
			first?.focus();
			first?.click();
			return;
		}
		if (event.key === 'End') {
			event.preventDefault();
			const tabs = target
				.closest('[role="tablist"]')
				?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])');
			tabs?.[tabs.length - 1]?.focus();
			tabs?.[tabs.length - 1]?.click();
			return;
		}
		if (
			(isHorizontal && event.key === 'ArrowRight') ||
			(!isHorizontal && event.key === 'ArrowDown')
		) {
			event.preventDefault();
			moveFocus(target, 1);
		}
		if ((isHorizontal && event.key === 'ArrowLeft') || (!isHorizontal && event.key === 'ArrowUp')) {
			event.preventDefault();
			moveFocus(target, -1);
		}
	}
</script>

<div
	bind:this={listEl}
	role="tablist"
	aria-orientation={tabsState.orientation}
	data-ui="tabs-list"
	data-variant={variant}
	class={cn(
		className,
		'relative inline-flex items-center',
		variant === 'segmented' && 'rounded-[var(--radius-xl)] bg-secondary p-[3px]',
		variant === 'ghost' && 'gap-1',
		variant === 'default' && 'gap-1 pb-1'
	)}
	onkeydown={handleKeydown}
	onmouseover={handleMouseOver}
	onfocusin={handleMouseOver}
	onmouseleave={handleMouseLeave}
	onfocusout={handleMouseLeave}
	{...rest}
>
	<!-- Default: a faint hover highlight that fades in over the hovered tab,
	     sitting behind the underline indicator. -->
	{#if variant === 'default' && hover}
		<div
			aria-hidden="true"
			class="pointer-events-none absolute rounded-[var(--radius-md)] bg-foreground/[0.06] transition-[left,top,width,height,opacity] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none"
			style:left={`${hover.left}px`}
			style:top={`${hover.top}px`}
			style:width={`${hover.width}px`}
			style:height={`${hover.height}px`}
			style:opacity={hovering ? 1 : 0}
		></div>
	{/if}

	<!-- Ghost: the selected tab carries the ghost fill, which slides to follow
	     the pointer across tabs and returns to the selection on leave. -->
	{#if variant === 'ghost' && ghostRect}
		<div
			aria-hidden="true"
			class="pointer-events-none absolute rounded-[var(--radius-md)] bg-secondary/70 transition-[left,top,width,height] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none"
			style:left={`${ghostRect.left}px`}
			style:top={`${ghostRect.top}px`}
			style:width={`${ghostRect.width}px`}
			style:height={`${ghostRect.height}px`}
			style:transition={ready ? undefined : 'none'}
		></div>
	{/if}

	<!-- Active indicator -->
	{#if indicator}
		{#if variant === 'default'}
			<!-- 2px underline anchored to the bottom of the list; the gap below the tabs
			     is the list's bottom padding (pb-3 below), so it reads as a real underline -->
			<div
				aria-hidden="true"
				class="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-foreground transition-[left,width] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none"
				style:left={`${indicator.left}px`}
				style:width={`${indicator.width}px`}
				style:transition={ready ? undefined : 'none'}
			></div>
		{:else if variant === 'segmented'}
			<!-- elevated white pill on the muted track (iOS-style segmented control) -->
			<div
				aria-hidden="true"
				class="pointer-events-none absolute rounded-[var(--radius-lg)] bg-card ring-1 ring-border/50 transition-[left,top,width,height] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none"
				style:left={`${indicator.left}px`}
				style:top={`${indicator.top}px`}
				style:width={`${indicator.width}px`}
				style:height={`${indicator.height}px`}
				style:transition={ready ? undefined : 'none'}
			></div>
		{/if}
	{/if}
	{@render children?.()}
</div>
