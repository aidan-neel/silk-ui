<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn, type DefaultProps } from '@sivir/ui/utils';
	import { useIsDark } from '@sivir/ui/is-dark.svelte.ts';
	import { getModalContext } from '../modal/context.svelte';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	let { class: className, children, onclick, ...rest }: Props = $props();

	const modal = getModalContext();
	let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);

	/** Cancel reads as outline in light, ghost in dark. */
	const isDark = useIsDark();
	const cancelVariant = $derived(isDark.current ? 'ghost' : 'outline');

	onMount(() => {
		element?.focus();
	});
</script>

<Button
	bind:element
	onclick={() => {
		modal.state.open = false;
		onclick?.();
	}}
	variant={cancelVariant}
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
