<script lang="ts">
	import * as Modal from '@sivir-ui/svelte/components/modal';
	import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';

	type Props = {
		allowClickOutside?: boolean;
		/** Max-width preset. Defaults to `md`. */
		size?: 'sm' | 'md' | 'lg' | 'xl';
		/** Show the top-right close (X) button. Defaults to `true`. */
		showClose?: boolean;
	} & DefaultProps;

	let {
		class: className,
		allowClickOutside = false,
		size = 'md',
		showClose = true,
		children,
		...rest
	}: Props = $props();

	const maxWidthClass = $derived(
		(
			{
				// token-lint-disable-next-line no-literal-length
				sm: 'md:max-w-[18rem]',
				md: 'md:max-w-xs',
				lg: 'md:max-w-md',
				xl: 'md:max-w-xl'
			} as const
		)[size]
	);
</script>

<Modal.Content
	{allowClickOutside}
	{maxWidthClass}
	{size}
	{showClose}
	role="alertdialog"
	panelIdPrefix="alert-dialog"
	data-ui="alert-dialog-content"
	class={cn(className, 'rounded-[var(--radius-xl)]')}
	{...rest}
>
	{@render children?.()}
</Modal.Content>
