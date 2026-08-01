<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { cn } from '@sivir-ui/svelte/utils';

	const { children, class: className, ...rest }: Popover.PopoverContentProps = $props();
</script>

<Popover.Content
	{...rest}
	role="none"
	tabindex={-1}
	focusTrap={false}
	data-ui="combobox-content"
	class={cn(className, 'min-w-[var(--popover-trigger-width)] w-[var(--popover-trigger-width)]')}
	surfaceClass="p-1"
>
	{@render children?.()}
</Popover.Content>
