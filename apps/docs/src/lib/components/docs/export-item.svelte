<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		title,
		...rest
	}: {
		children: Snippet;
		class?: string;
		title: string;
	} = $props();
</script>

<p {...rest} class={cn(classProp, `text-foreground-muted`)}>
	<span class="text-foreground px-3">•</span><span
		class="text-foreground [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] [font-family:var(--font-header),sans-serif]"
		>{title} -</span
	>
	{@render children?.()}
</p>
