<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import ComboboxSearch from './combobox-search.svelte';
    import { getComboboxContext } from './context.svelte';

    const { children, class: className, ...rest }: Popover.PopoverContentProps = $props();
    const { state: comboboxState } = getComboboxContext();
</script>

<Popover.Content
    {...rest}
    role="none"
    tabindex={-1}
    focusTrap={false}
    data-ui="combobox-content"
    class={cn(className, 'min-w-[var(--popover-trigger-width)] w-[var(--popover-trigger-width)]')}
    surfaceClass="overflow-hidden p-0"
>
    {#if comboboxState.searchPlacement === 'menu'}
        <div class="flex h-full min-h-0 max-h-[var(--popover-available-height)] flex-col">
            <ComboboxSearch />
            {@render children?.()}
        </div>
    {:else}
        <div class="flex h-full min-h-0 flex-col">
            {@render children?.()}
        </div>
    {/if}
</Popover.Content>
