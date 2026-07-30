<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { onMount, type Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { getSelectContext } from './context.svelte';
	import { getPopoverContext } from '../popover/context.svelte';

	const { id, state: selectState, labels, values } = getSelectContext();
	const { state: popoverState } = getPopoverContext();

	type Props = {
		value: string;
		label?: string;
		children?: Snippet;
	} & ButtonProps;

	let { children, class: className, value, label, onclick: userOnclick, ...rest }: Props = $props();
	let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();

	function resolveLabel() {
		if (label) return label;
		const fromAttr = element
			?.querySelector<HTMLElement>('[data-select-label]')
			?.textContent?.trim();
		if (fromAttr) return fromAttr;
		return element?.textContent?.trim() ?? '';
	}

	/**
	 * Registers the item's value and display label with the Select root.
	 *
	 * This records the display label only -- it must never write
	 * `selectState.selectedLabel`, because doing so on menu open made
	 * pre-filled triggers jump the moment labels resolved. When the label is not
	 * in the DOM yet, one animation frame is given for it to appear.
	 */
	onMount(() => {
		const itemValue = value;
		values.add(itemValue);

		const resolved = resolveLabel();
		if (resolved) labels.set(itemValue, resolved);
		else {
			const raf = requestAnimationFrame(() => {
				const again = resolveLabel();
				if (again) labels.set(itemValue, again);
			});
			return () => {
				cancelAnimationFrame(raf);
				values.delete(itemValue);
			};
		}

		return () => {
			values.delete(itemValue);
		};
	});
</script>

<Button
	bind:element
	id={`select-${id}-option-${value}`}
	role="option"
	aria-selected={selectState.value === value}
	{...rest}
	onclick={() => {
		const resolved = resolveLabel() || labels.get(value) || value;
		labels.set(value, resolved);
		selectState.value = value;
		selectState.selectedLabel = resolved;
		selectState.open = false;
		popoverState.buttonRef?.focus();
		userOnclick?.();
	}}
	class={cn(className, 'sivir-menu-item')}
	unstyled
>
	{@render children?.()}

	{#if selectState.value === value}
		<div aria-hidden="true">
			<Check />
		</div>
	{/if}
</Button>
