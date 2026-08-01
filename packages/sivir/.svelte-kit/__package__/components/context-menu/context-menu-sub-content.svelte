<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { cn } from '@sivir-ui/svelte/utils';
	import type { ContextMenuSubContentProps } from '.';

	let { class: className, children, ...rest }: ContextMenuSubContentProps = $props();
</script>

<Popover.Content
	{...rest}
	portal={false}
	data-ui="context-submenu-content"
	class={cn(className, 'min-w-44')}
	surfaceClass="flex flex-col gap-0 p-1"
>
	{@render children?.()}
</Popover.Content>
