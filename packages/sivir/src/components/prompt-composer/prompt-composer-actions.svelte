<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { PromptComposerActionsProps } from '.';
	import { getPromptComposerContext } from './context.svelte';

	let { children, class: className, ...rest }: PromptComposerActionsProps = $props();
	const context = getPromptComposerContext();
</script>

<div
	{...rest}
	data-ui="prompt-composer-actions"
	data-state={context.status}
	class={cn(className, 'flex min-w-0 flex-1 flex-wrap items-center gap-1')}
>
	{@render children?.()}
</div>
