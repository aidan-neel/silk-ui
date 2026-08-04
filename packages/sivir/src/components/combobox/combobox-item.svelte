<script lang="ts">
import Check from '@lucide/svelte/icons/check';
import { Button, type ButtonProps } from '@sivir-ui/svelte/components/button';
import { cn } from '@sivir-ui/svelte/utils';
import { onMount } from 'svelte';
import { getPopoverContext } from '../popover/context.svelte';
import type { ComboboxItem } from '.';
import { getComboboxContext } from './context.svelte';

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
const visible = $derived(
    comboboxState.searchContent === '' ||
        Array.from(comboboxState.results).some((result) => result.value === item.value)
);

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

<Button
    bind:element={el}
    id={optionId}
    role="option"
    aria-selected={comboboxState.selected?.value === item.value}
    aria-hidden={!visible || undefined}
    inert={!visible || undefined}
    data-collection-item
    data-collection-active={comboboxState.activeValue === item.value}
    data-combobox-value={value}
    data-visible={visible}
    tabindex={-1}
    {...rest}
    onclick={close}
    class={cn(
        className,
        'sivir-menu-item flex-row gap-3 overflow-hidden text-sm opacity-100 transition-[height,opacity,border-width] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] motion-reduce:transition-none data-[visible=false]:h-0 data-[visible=false]:border-y-0 data-[visible=false]:opacity-0'
    )}
    unstyled
>
    {label}
    {#if comboboxState.selected?.value === item.value}
        <div aria-hidden="true">
            <Check />
        </div>
    {/if}
</Button>
