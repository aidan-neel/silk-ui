<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};

	let props: Props = $props();
</script>

<Popover.Content
	portal={false}
	data-ui="dropdown-submenu-content"
	class={props.class}
	surfaceClass="flex flex-col gap-0 p-1"
>
	{@render props.children?.()}
</Popover.Content>
