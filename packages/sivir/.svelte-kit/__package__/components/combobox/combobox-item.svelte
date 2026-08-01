<script lang="ts">
    import { Button, type ButtonProps } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import Check from '@lucide/svelte/icons/check';

    import type { ComboboxItem } from '.';
    import { getComboboxContext } from './context.svelte';
    import { getPopoverContext } from '../popover/context.svelte';

    const { id, state: comboboxState } = getComboboxContext();
    const { state: popoverState } = getPopoverContext();
    const localId = $props.id();
    const optionId = `combobox-${id}-option-${localId}`;

    type Props = {
        class?: string;
        value: string;
        label: string;
        callback?: () => void;
    } & ButtonProps;

    let { label, value, class: className, callback, ...rest }: Props = $props();
    let el = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();
    let item: ComboboxItem = $derived({
        id: optionId,
        value: value,
        label: label,
        callback: callback,
        ref: el
    }) as ComboboxItem;

    function close() {
        comboboxState.selected = item;
        comboboxState.activeValue = item.value;
        comboboxState.open = false;
        popoverState.buttonRef?.focus();
        callback?.();
    }

    onMount(() => {
        comboboxState.items.add(item);
        if (comboboxState.open && comboboxState.activeValue === undefined) {
            comboboxState.activeValue = item.value;
        }
        return () => comboboxState.items.delete(item);
    });
</script>

{#if comboboxState.searchContent === '' || Array.from(comboboxState.results).some((r) => r.value === item.value)}
    <Button
        bind:element={el}
        id={optionId}
        role="option"
        aria-selected={comboboxState.selected?.value === item.value}
        data-collection-item
        data-collection-active={comboboxState.activeValue === item.value}
        tabindex={-1}
        {...rest}
        onpointerenter={() => {
            comboboxState.activeValue = item.value;
        }}
        onclick={close}
        class={cn(className, 'sivir-menu-item flex-row gap-3 text-sm')}
        unstyled
    >
        {label}
        {#if comboboxState.selected?.value === item.value}
            <div aria-hidden="true">
                <Check />
            </div>
        {/if}
    </Button>
{/if}
