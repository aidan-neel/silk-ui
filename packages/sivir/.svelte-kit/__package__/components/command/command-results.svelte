<!-- token-lint-disable-file -->
<script lang="ts">
    import { travelingHighlight } from '@sivir-ui/svelte/utils';
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
    use:travelingHighlight
    class="max-h-full overflow-y-auto overscroll-contain p-1 [scrollbar-gutter:stable]"
>
    {@render children?.()}
    {#if command.searchContent !== '' && command.results.length === 0}
        <div class="flex w-full items-center justify-center p-3">
            <p class="text-sm text-foreground-muted">No results found</p>
        </div>
    {/if}
</div>
