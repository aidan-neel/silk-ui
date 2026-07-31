<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import type { ReasoningRootProps } from '.';
	import { setReasoningContext } from './context.svelte';

	let {
		streaming = false,
		open = $bindable(false),
		children,
		class: className,
		...rest
	}: ReasoningRootProps = $props();

	const id = $props.id();
	setReasoningContext({
		id,
		get open() {
			return open;
		},
		set open(value) {
			open = value;
		},
		get streaming() {
			return streaming;
		}
	});
</script>

<section
	data-ui="reasoning"
	data-streaming={streaming}
	aria-busy={streaming}
	class={cn(className, 'w-full max-w-full text-sm text-foreground')}
	{...rest}
>
	{@render children?.()}
</section>
