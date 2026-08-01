<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...rest }: Props = $props();
</script>

<div
	{...rest}
	data-ui="menu-separator"
	class={cn(className, 'mx-1 my-1 h-[var(--border-size)] rounded-[var(--radius-xl)] bg-border')}
>
	{@render children?.()}
</div>
