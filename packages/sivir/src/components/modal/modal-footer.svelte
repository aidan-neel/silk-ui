<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { ModalFooterProps } from '.';

	let { class: className, children, ...rest }: ModalFooterProps = $props();
</script>

<div
	{...rest}
	class={cn(
		className,
		'flex w-full flex-col-reverse justify-end gap-2 border-border bg-transparent sm:flex-row sm:items-center'
	)}
>
	{@render children?.()}
</div>
