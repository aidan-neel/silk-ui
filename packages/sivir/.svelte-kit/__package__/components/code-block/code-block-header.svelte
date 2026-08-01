<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { CodeBlockHeaderProps } from '.';

	let { children, class: className, ...rest }: CodeBlockHeaderProps = $props();
</script>

<!-- The tab List flows from the left; Actions carries `ml-auto` to pin right. -->
<div
	data-ui="code-block-header"
	class={cn(
		className,
		'flex items-center gap-4 bg-[color-mix(in_oklab,var(--color-foreground)_3%,var(--color-card))] px-2'
	)}
	{...rest}
>
	{@render children?.()}
</div>
