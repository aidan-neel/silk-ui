<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { ApprovalRequestDetailsProps } from '.';

	let { class: className, children, ...rest }: ApprovalRequestDetailsProps = $props();
</script>

<div
	{...rest}
	data-ui="approval-request-details"
	class={cn(
		className,
		'overflow-x-auto rounded-[var(--radius-md)] border border-border bg-secondary/50 px-3 py-2 font-mono text-xs leading-5 text-foreground-muted'
	)}
>
	{@render children?.()}
</div>
