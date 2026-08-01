<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { PromptComposerToolbarProps } from '.';
	import { getPromptComposerContext } from './context.svelte';

	let {
		children,
		class: className,
		'aria-label': ariaLabel = 'Message actions',
		...rest
	}: PromptComposerToolbarProps = $props();

	const context = getPromptComposerContext();
</script>

<div
	{...rest}
	data-ui="prompt-composer-toolbar"
	data-state={context.status}
	role="toolbar"
	aria-label={ariaLabel}
	class={cn(className, 'flex min-w-0 flex-wrap items-center justify-between gap-1 px-2 pb-2 pt-1')}
>
	{@render children?.()}
</div>
