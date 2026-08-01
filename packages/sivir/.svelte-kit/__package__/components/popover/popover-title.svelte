<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { PopoverTitleProps } from '.';
	import { getPopoverContext } from './context.svelte';

	const { id: key } = getPopoverContext();

	let { children, class: classProp, ...rest }: PopoverTitleProps = $props();
</script>

<p
	id={`popover-${String(key)}-title`}
	{...rest}
	class={cn(
		classProp,
		'text-foreground [font-family:var(--font-header)] [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] text-balance'
	)}
>
	{@render children?.()}
</p>
