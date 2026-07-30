<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn, type DefaultProps } from '@sivir/ui/utils';
	import { getModalContext } from '../modal/context.svelte';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	let { class: className, children, onclick, ...rest }: Props = $props();
	const modal = getModalContext();
</script>

<Button
	onclick={() => {
		modal.state.open = false;
		onclick?.();
	}}
	{...rest}
	class={cn(className, 'flex w-full flex-row items-center justify-center gap-2 sm:flex-1')}
>
	{@render children?.()}
</Button>
