<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { closeMenuLayers, cn } from '@sivir-ui/svelte/utils';
    import { getPopoverContext } from '../popover/context.svelte';
    import type { DropdownMenuRadioItemProps } from '.';
    import { getDropdownMenuContext } from './context.svelte';
    import { getDropdownMenuRadioGroupContext } from './radio-group-context.svelte';

    let {
        value,
        children,
        class: className,
        onclick: userOnclick,
        element = $bindable(),
        ...rest
    }: DropdownMenuRadioItemProps = $props();

    const { state: popoverState } = getPopoverContext();
    const { ancestors } = getDropdownMenuContext();
    const group = getDropdownMenuRadioGroupContext();
    const checked = $derived(group.value === value);

    function select(event: MouseEvent) {
        const target = event.currentTarget as HTMLButtonElement;
        if (!target.disabled && !checked) {
            group.value = value;
            group.onValueChange?.(value);
        }
        userOnclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement });
        if (!event.defaultPrevented && !target.disabled) {
            closeMenuLayers(popoverState, ancestors);
        }
    }
</script>

<Button
    bind:element
    {...rest}
    role="menuitemradio"
    aria-checked={checked}
    data-collection-item
    onclick={select}
    class={cn(className, 'sivir-menu-item flex-row gap-3 text-sm')}
    unstyled
>
    <span class="grid size-4 shrink-0 place-items-center" aria-hidden="true">
        {#if checked}
            <Check size={13} strokeWidth={2.25} />
        {/if}
    </span>
    {@render children?.()}
</Button>
