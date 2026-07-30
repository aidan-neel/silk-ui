<script lang="ts">
	import type { ContextMenuItemProps } from '.';
	import { Button } from '@sivir/ui/components/button';
	import { closeMenuLayers, cn } from '@sivir/ui/utils';
	import { getContextMenuContext } from './context.svelte';

	const { state: contextMenuState, ancestors } = getContextMenuContext();

	let {
		class: className,
		children,
		callback,
		inset = false,
		...rest
	}: ContextMenuItemProps = $props();
</script>

<Button
	role="menuitem"
	{...rest}
	onclick={() => {
		closeMenuLayers(contextMenuState, ancestors);
		callback?.();
	}}
	class={cn(className, 'sivir-menu-item', inset && 'pl-8')}
	unstyled
>
	{@render children?.()}
</Button>
