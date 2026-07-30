<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { ScrollAreaProps } from '.';

	let { class: className, children, orientation = 'vertical', ...rest }: ScrollAreaProps = $props();

	let scroller = $state<HTMLDivElement | undefined>();
	let scrollTop = $state(0);
	let scrollHeight = $state(0);
	let clientHeight = $state(0);

	const atTop = $derived(scrollTop <= 1);
	const atBottom = $derived(scrollTop + clientHeight >= scrollHeight - 1);
	const overflows = $derived(scrollHeight - clientHeight > 1);
	const showCues = $derived(orientation === 'vertical' && overflows);

	function measure() {
		if (!scroller) return;
		scrollTop = scroller.scrollTop;
		scrollHeight = scroller.scrollHeight;
		clientHeight = scroller.clientHeight;
	}

	/**
	 * Measure on mount and whenever the content or viewport size changes, so the
	 * edge cues are correct before the first scroll event fires.
	 */
	$effect(() => {
		if (!scroller) return;
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(scroller);
		for (const child of Array.from(scroller.children)) ro.observe(child);
		return () => ro.disconnect();
	});
</script>

<div
	bind:this={scroller}
	data-ui="scroll-area"
	data-orientation={orientation}
	class={cn(
		className,
		'relative overscroll-contain [scrollbar-color:color-mix(in_srgb,var(--color-foreground)_22%,transparent)_transparent] [scrollbar-width:thin]',
		'[&::-webkit-scrollbar]:size-2.5 [&::-webkit-scrollbar-track]:bg-transparent',
		'[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-[color-mix(in_srgb,var(--color-foreground)_18%,transparent)] [&::-webkit-scrollbar-thumb]:bg-clip-padding',
		'[&::-webkit-scrollbar-thumb:hover]:bg-[color-mix(in_srgb,var(--color-foreground)_32%,transparent)] [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding',
		orientation === 'horizontal'
			? 'overflow-x-auto overflow-y-hidden'
			: orientation === 'vertical'
				? 'overflow-y-auto overflow-x-hidden'
				: 'overflow-auto'
	)}
	onscroll={measure}
	{...rest}
>
	{#if showCues}
		<!-- Top edge cue: sticky so it pins to the top of the scrollport. -->
		<div aria-hidden="true" class="sticky top-0 z-10 h-0">
			<div
				class={cn(
					'pointer-events-none absolute inset-x-0 top-0 flex h-7 items-start justify-center bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-panel,#fff)_92%,transparent),transparent)] transition-opacity duration-150',
					atTop ? 'opacity-0' : 'opacity-100'
				)}
			>
				<ChevronUp size={13} class="mt-0.5 text-foreground-muted" />
			</div>
		</div>
	{/if}

	{@render children?.()}

	{#if showCues}
		<!-- Bottom edge cue: sticky so it pins to the bottom of the scrollport. -->
		<div aria-hidden="true" class="sticky bottom-0 z-10 h-0">
			<div
				class={cn(
					'pointer-events-none absolute inset-x-0 bottom-0 flex h-7 items-end justify-center bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-panel,#fff)_92%,transparent),transparent)] transition-opacity duration-150',
					atBottom ? 'opacity-0' : 'opacity-100'
				)}
			>
				<ChevronDown size={13} class="mb-0.5 text-foreground-muted" />
			</div>
		</div>
	{/if}
</div>
