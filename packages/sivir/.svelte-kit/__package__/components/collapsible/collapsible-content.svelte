<script lang="ts">
	import { themedSlide } from '@sivir-ui/svelte/transition';
	import { cn } from '@sivir-ui/svelte/utils';
	import type { CollapsibleContentProps } from '.';
	import { getCollapsibleContext } from './context.svelte';

	let { class: className, children, ...rest }: CollapsibleContentProps = $props();
	const { id, state } = getCollapsibleContext();
</script>

{#if state.open}
	<div
		id={`collapsible-${id}`}
		data-ui="collapsible-content"
		data-state="open"
		transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
		class={cn(className, 'overflow-hidden')}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
