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
    dismissLayer={comboboxState.appearance !== 'input'}
    data-ui="combobox-content"
    class={cn(className, 'min-w-[var(--popover-trigger-width)] w-[var(--popover-trigger-width)]')}
    surfaceClass="flex min-h-0 flex-col overflow-hidden p-0"
>
    <div class={cn(className, 'flex min-h-0 min-w-0 flex-1 flex-col')}>
        {#if comboboxState.searchPlacement === 'menu'}
            <ComboboxSearch />
        {/if}
        {@render children?.()}
    </div>
</Popover.Content>
