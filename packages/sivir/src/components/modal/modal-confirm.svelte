<script lang="ts">
	import type { ModalConfirmProps } from '.';
	import { Button } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { getModalContext } from './context.svelte';

	const modal = getModalContext();
	let { class: className, children, onclick, variant, ...rest }: ModalConfirmProps = $props();
	const confirmVariant = $derived(variant ?? (modal.state.error ? 'destructive' : 'primary'));
</script>

<Button
	{...rest}
	variant={confirmVariant}
	onclick={() => {
		modal.state.open = false;
		onclick?.();
	}}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
