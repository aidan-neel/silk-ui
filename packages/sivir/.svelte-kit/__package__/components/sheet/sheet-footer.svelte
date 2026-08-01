<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { SheetFooterProps } from '.';

	let { class: className, children, ...rest }: SheetFooterProps = $props();
</script>

<div {...rest} class={cn(className, `flex flex-col gap-2 mt-auto`)}>
	{@render children?.()}
</div>
