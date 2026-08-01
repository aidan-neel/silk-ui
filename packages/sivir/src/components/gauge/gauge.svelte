<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { GaugeProps, GaugeTone } from '.';

	let {
		value,
		max = 100,
		label,
		size = 24,
		strokeWidth = 2,
		tone = 'primary',
		children,
		class: className,
		...rest
	}: GaugeProps = $props();

	const toneClasses: Record<GaugeTone, string> = {
		primary: 'text-primary',
		muted: 'text-foreground-muted',
		success: 'text-success',
		warning: 'text-warning',
		error: 'text-error'
	};
	const safeMax = $derived(Math.max(max, 1));
	const safeSize = $derived(Math.max(size, 16));
	const safeStrokeWidth = $derived(Math.min(Math.max(strokeWidth, 1), safeSize / 2));
	const clamped = $derived(Math.min(Math.max(value, 0), safeMax));
	const radius = $derived((safeSize - safeStrokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const offset = $derived(circumference * (1 - clamped / safeMax));
	const accessibleLabel = $derived(label ?? `${clamped} of ${safeMax}`);
</script>

<div
	data-ui="gauge"
	role="meter"
	aria-label={accessibleLabel}
	aria-valuemin={0}
	aria-valuemax={safeMax}
	aria-valuenow={clamped}
	class={cn(className, 'relative inline-grid shrink-0 place-items-center')}
	style:width={`${safeSize}px`}
	style:height={`${safeSize}px`}
	{...rest}
>
	<svg
		aria-hidden="true"
		viewBox={`0 0 ${safeSize} ${safeSize}`}
		class="absolute inset-0 -rotate-90 overflow-visible"
	>
		<circle
			cx={safeSize / 2}
			cy={safeSize / 2}
			r={radius}
			fill="none"
			stroke-width={safeStrokeWidth}
			class="stroke-secondary"
		/>
		<circle
			cx={safeSize / 2}
			cy={safeSize / 2}
			r={radius}
			fill="none"
			stroke-width={safeStrokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			class={cn(
				toneClasses[tone],
				'stroke-current transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none'
			)}
		/>
	</svg>
	<span aria-hidden="true" class="relative text-xs leading-none text-foreground-muted tabular-nums">
		{#if children}
			{@render children()}
		{:else}
			{clamped}
		{/if}
	</span>
</div>
