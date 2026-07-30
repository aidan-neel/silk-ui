<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { type Snippet } from 'svelte';
	import { ChevronRight } from '@lucide/svelte';
	import * as Popover from '@sivir/ui/components/popover';

	type SubTriggerProps = {
		class?: string;
		children?: Snippet;
	} & Omit<Popover.PopoverTriggerProps, 'children' | 'class'>;

	let { class: className, children, ...rest }: SubTriggerProps = $props();
</script>

<Popover.Trigger {...rest} class={cn(className, 'sivir-menu-item')} unstyled>
	<span class="min-w-0 flex-1 text-left">
		{@render children?.()}
	</span>
	<ChevronRight class="ml-2 shrink-0 text-foreground-muted" size={18} />
</Popover.Trigger>
