<!-- token-lint-disable-file -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getCommandContext } from './context.svelte';

	const command = getCommandContext();

	type Props = {
		children?: Snippet;
	};

	const { children }: Props = $props();
</script>

<div
	id={`${command.id}-listbox`}
	role="listbox"
	aria-label="Command results"
	class="max-h-full overflow-y-auto overscroll-contain px-1 pt-1"
>
	{@render children?.()}
	{#if command.searchContent !== '' && command.results.length === 0}
		<div class="flex w-full items-center justify-center p-3">
			<p class="text-sm text-foreground-muted">No results found</p>
		</div>
	{/if}
</div>
