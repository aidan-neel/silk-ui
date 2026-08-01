<script lang="ts">
	import { type Snippet } from 'svelte';
	import { getComboboxContext } from './context.svelte';

	const { id, state: comboboxState } = getComboboxContext();

	type Props = {
		children?: Snippet;
	};

	const { children }: Props = $props();
</script>

<div
	role="listbox"
	id={`combobox-${id}-listbox`}
	class="flex max-h-full flex-col gap-0 overflow-y-auto p-1"
>
	{#if comboboxState.searchContent === ''}
		{@render children?.()}
	{:else if comboboxState.results.size > 0}
		{@render children?.()}
	{:else}
		<div class="flex w-full items-center justify-center p-3">
			<p
				class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
			>
				No results found
			</p>
		</div>
	{/if}
</div>
