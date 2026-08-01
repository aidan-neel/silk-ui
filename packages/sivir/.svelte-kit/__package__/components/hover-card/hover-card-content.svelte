<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { cn } from '@sivir-ui/svelte/utils';
	import type { HoverCardContentProps } from '.';

	/**
	 * As of 2.0.0 hover-card collapses to a popover wrapper and popover owns
	 * placement at the Root level. `side` and `align` on HoverCardContentProps
	 * are kept for type-API stability but are not consumed: placement comes from
	 * the Root prop on Popover.Root, and HoverCard.Root forwards none today, so
	 * it defaults to `bottom`. A future minor release can wire them through or
	 * deprecate them.
	 */
	let {
		class: className,
		children,
		side: _side,
		align: _align,
		...rest
	}: HoverCardContentProps = $props();
</script>

<Popover.Content
	role="dialog"
	aria-modal="false"
	allowClickOutside={false}
	{...rest}
	class={cn(className, 'w-64 text-[var(--font-size-body)]')}
	surfaceClass="p-3"
>
	{@render children?.()}
</Popover.Content>
