<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { Button } from '@sivir-ui/svelte/components/button';
	import type { FullscreenNavCloseProps } from '.';
	import { getFullscreenNavContext } from './context.svelte';

	let {
		class: className,
		children,
		onclick: userOnclick,
		...rest
	}: FullscreenNavCloseProps = $props();
	const { state } = getFullscreenNavContext();
</script>

<Button
	variant="ghost"
	size="icon"
	aria-label="Close navigation menu"
	onclick={(event: MouseEvent) => {
		state.open = false;
		userOnclick?.(event);
	}}
	class={className}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		<X aria-hidden="true" />
	{/if}
</Button>
