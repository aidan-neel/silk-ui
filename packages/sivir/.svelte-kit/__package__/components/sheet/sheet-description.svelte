<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { SheetDescriptionProps } from '.';
	import { getSheetContext } from './context.svelte';

	let { class: className, children, ...rest }: SheetDescriptionProps = $props();
	const { id } = getSheetContext();
</script>

<p
	{...rest}
	id={id + '-desc'}
	class={cn(
		className,
		'[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-pretty text-foreground-muted'
	)}
>
	{@render children?.()}
</p>
