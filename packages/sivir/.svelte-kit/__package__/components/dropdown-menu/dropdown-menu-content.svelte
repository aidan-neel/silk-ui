<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { cn } from '@sivir-ui/svelte/utils';
	import { type Snippet } from 'svelte';
	import { getDropdownMenuContext } from './context.svelte';

	const { inverted } = getDropdownMenuContext();
	const INVERTED_MENU =
		'[--color-panel:hsl(0_0%_13%)] [--color-border:rgb(255_255_255/0.1)] [--color-foreground:hsl(0_0%_96%)] [--color-foreground-muted:hsl(0_0%_72%)] [--color-accent-tint:rgb(255_255_255/0.12)]';

	type Props = {
		children: Snippet;
		class?: string;
	};

	let props: Props = $props();
</script>

<Popover.Content
	role="menu"
	tabindex={-1}
	data-ui="dropdown-menu-content"
	class={cn(props.class, 'min-w-[var(--popover-trigger-width)] w-max', inverted && INVERTED_MENU)}
	surfaceClass="flex flex-col gap-0 p-1"
>
	{@render props.children?.()}
</Popover.Content>
