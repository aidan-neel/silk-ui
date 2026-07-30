<script lang="ts">
	import { button } from './variants';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn, pressable } from '@sivir/ui/utils';
	import type { ButtonProps } from '.';

	let {
		href,
		variant = 'primary',
		children,
		class: classProp,
		size = 'md',
		element = $bindable(),
		unstyled = false,
		onclick,
		...rest
	}: ButtonProps = $props();

	const classes = $derived(cn(classProp, unstyled ? undefined : button({ variant, size })));
</script>

{#if href}
	<a
		bind:this={element as HTMLAnchorElement}
		use:pressable
		{href}
		data-ui="button"
		data-variant={variant}
		data-size={size}
		class={classes}
		aria-disabled={(rest as HTMLAnchorAttributes)['aria-disabled']}
		onclick={() => onclick?.()}
		onkeydown={(e) => {
			if ((e.code === 'Space' || e.key === ' ') && e.currentTarget.matches(':focus-visible')) {
				e.preventDefault();
				onclick?.();
			}
		}}
		{...rest as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={element as HTMLButtonElement}
		use:pressable
		type={(rest as HTMLButtonAttributes).type ?? 'button'}
		data-ui="button"
		data-variant={variant}
		data-size={size}
		class={classes}
		onclick={() => onclick?.()}
		onkeydown={(e) => {
			if ((e.code === 'Space' || e.key === ' ') && e.currentTarget.matches(':focus-visible')) {
				e.preventDefault();
				onclick?.();
			}
		}}
		{...rest as HTMLButtonAttributes}
	>
		{@render children?.()}
	</button>
{/if}
