<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn, type DefaultProps } from '@sivir/ui/utils';
	import { getModalContext } from '../modal/context.svelte';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	const modal = getModalContext();
	let { class: className, children, onclick, variant, ...rest }: Props = $props();
	const confirmVariant = $derived(variant ?? (modal.state.error ? 'destructive' : 'primary'));
</script>

<Button
	{...rest}
	variant={confirmVariant}
	onclick={() => {
		modal.state.open = false;
		onclick?.();
	}}
	class={cn(className, 'flex w-full flex-row items-center justify-center gap-2 sm:flex-1')}
>
	{@render children?.()}
</Button>
