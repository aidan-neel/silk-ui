<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { TabsContentProps, TabsState } from '.';
    import { toTabIdPart } from './id';

    let {
        children,
        class: className,
        value,
        forceMount = false,
        ...rest
    }: TabsContentProps = $props();

    const tabsState = getContext<TabsState>('tabs');

    const triggerId = $derived(`${tabsState.id}-trigger-${toTabIdPart(value)}`);
    const contentId = $derived(`${tabsState.id}-content-${toTabIdPart(value)}`);
    const active = $derived(tabsState.value === value);
</script>

{#if forceMount || active}
    <div
        role="tabpanel"
        id={contentId}
        aria-labelledby={triggerId}
        data-ui="tabs-content"
        data-state={active ? 'active' : 'inactive'}
        hidden={!active}
        tabindex="0"
        class={cn(className, 'focus-visible:outline-none')}
        {...rest}
    >
        {@render children?.()}
    </div>
{/if}
