<script lang="ts">
	import { themedSlide } from '@sivir-ui/svelte/transition';
	import { cn } from '@sivir-ui/svelte/utils';
	import type { ReasoningContentProps } from '.';
	import { getReasoningContext } from './context.svelte';

	let { class: className, children, ...rest }: ReasoningContentProps = $props();
	const reasoning = getReasoningContext();
</script>

{#if reasoning.open}
	<div
		{...rest}
		id={`reasoning-${reasoning.id}`}
		data-ui="reasoning-content"
		transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
		class={cn(className, 'mt-1 overflow-hidden text-sm leading-6 text-foreground-muted')}
	>
		{@render children?.()}
	</div>
{/if}
