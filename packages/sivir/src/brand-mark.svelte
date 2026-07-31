<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';

	let {
		size = 30,
		class: className,
		label
	}: { size?: number; class?: string; label?: string } = $props();
</script>

<span
	data-ui="brand-mark"
	class={cn(
		className,
		'inline-grid shrink-0 place-items-center bg-transparent text-[var(--color-foreground,#252220)] shadow-none'
	)}
	style:width={`${size}px`}
	style:height={`${size}px`}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
>
	<svg
		viewBox="3.75 3.75 12.5 12.5"
		fill="none"
		stroke="currentColor"
		stroke-width="1.7"
		stroke-linecap="round"
		class="block size-full"
		aria-hidden="true"
	>
		<path d="M5 6.5h10M5 10h7M5 13.5h4" />
	</svg>
</span>
