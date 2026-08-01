<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { ToolOutputProps } from '.';

	let { label = 'Output', children, class: className, ...rest }: ToolOutputProps = $props();
</script>

<div data-ui="tool-output" class={cn(className, 'mt-3 flex flex-col gap-1.5')} {...rest}>
	<span class="text-xs font-[var(--font-weight-label)] text-foreground-muted">{label}</span>
	<div
		class="rounded-[var(--radius-md)] border border-border bg-card px-2.5 py-2 text-sm leading-5 text-foreground"
	>
		{@render children?.()}
	</div>
</div>
