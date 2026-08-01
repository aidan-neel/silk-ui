<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { cn } from '@sivir-ui/svelte/utils';
	import { tick, type Snippet } from 'svelte';
	import { getSelectContext } from './context.svelte';
	import { getPopoverContext } from '../popover/context.svelte';

	const { state } = getSelectContext();
	const { state: popoverState } = getPopoverContext();

	type Props = {
		children: Snippet;
		class?: string;
	};

	let props: Props = $props();

	$effect(() => {
		if (!state.open) return;

		void tick().then(() => {
			const content = popoverState.popoverRef;
			if (!content) return;

			const selected =
				content.querySelector<HTMLElement>('[role="option"][aria-selected="true"]') ??
				content.querySelector<HTMLElement>('[role="option"]');
			selected?.focus();
		});
	});
</script>

<Popover.Content
	role="listbox"
	tabindex={-1}
	data-ui="select-content"
	class={cn(props.class, 'min-w-[var(--popover-trigger-width)] w-max')}
	surfaceClass="flex flex-col gap-0 p-1"
>
	{@render props.children?.()}
</Popover.Content>
