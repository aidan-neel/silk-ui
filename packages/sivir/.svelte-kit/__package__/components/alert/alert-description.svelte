<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		...rest
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<p
	{...rest}
	class={cn(
		classProp,
		'm-0 [font-size:var(--font-size-body,16px)] leading-[1.55] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-pretty text-foreground-muted'
	)}
>
	{@render children?.()}
</p>
