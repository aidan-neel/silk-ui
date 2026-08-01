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

<div {...rest} class={cn(classProp, `w-full flex items-center flex-row mt-6 justify-end gap-2`)}>
	{@render children?.()}
</div>
