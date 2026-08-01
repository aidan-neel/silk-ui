<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { Snippet } from 'svelte';
	import { getCommandContext } from './context.svelte';

	const command = getCommandContext();

	type Props = {
		children: Snippet;
		class?: string;
		heading: string;
	};

	let { children, class: className, heading, ...rest }: Props = $props();
</script>

<div {...rest} role="group" aria-label={heading} class="flex flex-col px-1 pt-1">
	{#if command.searchContent === ''}
		<p
			class={cn(
				className,
				'px-2 py-1 text-[length:var(--text-xs)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted select-none'
			)}
		>
			{heading}
		</p>
	{/if}

	{@render children?.()}
</div>
