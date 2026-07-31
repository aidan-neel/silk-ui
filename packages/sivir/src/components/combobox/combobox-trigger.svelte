<script lang="ts">
	import { tick } from 'svelte';
	import type { ComboboxState, ComboboxItem } from '.';
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { cn } from '@sivir-ui/svelte/utils';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Fuse from 'fuse.js';
	import { getComboboxContext } from './context.svelte';

	const { id, placeholder, state: comboboxState } = getComboboxContext();

	interface Props extends Omit<Popover.PopoverTriggerProps, 'children'> {
		class?: string;
		threshold?: number;
	}

	const { class: className, threshold = 0.28, variant = 'outline', ...rest }: Props = $props();

	let inputElement: HTMLInputElement | undefined = $state();
	const fuse = $derived(
		new Fuse(Array.from(comboboxState.items), {
			keys: ['value', 'label'],
			threshold,
			ignoreLocation: true,
			minMatchCharLength: 1
		})
	);

	function handleInput() {
		comboboxState.results = new Set<ComboboxItem>(
			fuse.search(comboboxState.searchContent).map((result) => result.item)
		);
	}

	function handleInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			const firstResult = [...comboboxState.results][0];
			if (firstResult) {
				comboboxState.selected = firstResult;
				comboboxState.open = false;
				firstResult.callback?.();
			}
		}
	}

	$effect(() => {
		if (!comboboxState.open) return;
		void tick().then(() => {
			inputElement?.focus({ preventScroll: true });
			inputElement?.select();
		});
	});
</script>

<Popover.Trigger
	{...rest}
	{variant}
	role="combobox"
	aria-haspopup="listbox"
	aria-controls={`combobox-${id}-listbox`}
	aria-expanded={comboboxState.open}
	aria-label={comboboxState.selected?.label
		? `Selected ${comboboxState.selected.label}`
		: 'Open combobox'}
	class={cn(
		className,
		'flex flex-row items-center justify-between focus-within:shadow-[var(--focus-ring)]',
		comboboxState.selected?.label ? 'text-foreground' : 'text-foreground-muted'
	)}
>
	<div class="min-w-0 flex-1 text-left">
		{#if comboboxState.open}
			<input
				bind:this={inputElement}
				bind:value={comboboxState.searchContent}
				{placeholder}
				oninput={handleInput}
				onkeydown={handleInputKeydown}
				class="w-full h-full bg-transparent text-foreground [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] placeholder:text-foreground-muted placeholder:[font-weight:var(--font-weight-button,500)] focus:outline-none"
				aria-label="Search options"
			/>
		{:else if comboboxState.selected?.label}
			<span class="block truncate text-foreground [font-weight:var(--font-weight-button,500)]">
				{comboboxState.selected.label}
			</span>
		{:else}
			<span
				class="block truncate text-foreground-muted [font-weight:var(--font-weight-button,500)]"
			>
				{placeholder}
			</span>
		{/if}
	</div>
	<ChevronDown size={18} class="ml-2 flex-shrink-0 text-foreground-muted" aria-hidden="true" />
</Popover.Trigger>
