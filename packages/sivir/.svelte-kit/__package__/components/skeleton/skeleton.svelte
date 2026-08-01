<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		w: width,
		h: height,
		unit = 'px',
		...rest
	}: {
		children?: Snippet;
		class?: string;
		w?: number;
		h?: number;
		unit?:
			| 'px'
			| 'rem'
			| 'em'
			| '%'
			| 'vh'
			| 'vw'
			| 'vmin'
			| 'vmax'
			| 'ch'
			| 'ex'
			| 'cm'
			| 'mm'
			| 'in'
			| 'pt'
			| 'pc';
	} = $props();
</script>

<!-- token-lint-disable-next-line -->
<div
	{...rest}
	class={cn(
		classProp,
		'animate-[skeleton-loading_2s_infinite_ease-in-out] rounded-lg bg-[linear-gradient(90deg,var(--color-secondary)_0%,var(--color-muted)_50%,var(--color-secondary)_100%)] bg-[length:200%_100%] motion-reduce:animate-none'
	)}
	style:height={height == null ? undefined : `${height}${unit}`}
	style:width={width == null ? undefined : `${width}${unit}`}
>
	{@render children?.()}
</div>

<style>
	:global {
		@keyframes skeleton-loading {
			from {
				background-position: 200% 0;
			}
			to {
				background-position: -200% 0;
			}
		}
	}
</style>
