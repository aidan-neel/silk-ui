<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { untrack } from 'svelte';
    import { SvelteSet } from 'svelte/reactivity';
    import type { ComboboxItem, ComboboxRootProps, ComboboxState } from '.';
    import { setComboboxContext } from './context.svelte';

    let {
        children,
        state_key,
        stateKey,
        open = $bindable(false),
        value = $bindable<string | undefined>(undefined),
        onValueChange,
        onOpenChange,
        ...rest
    }: ComboboxRootProps = $props();

    const generatedKey = $props.id();
    const key = untrack(() => stateKey ?? state_key ?? generatedKey);
    const comboboxState = $state<ComboboxState>({
        open: untrack(() => open),
        items: new SvelteSet(),
        results: new SvelteSet(),
        searchContent: '',
        searchPlacement: 'trigger',
        threshold: 0.28,
        appearance: 'button',
        activeValue: undefined
    });
    let syncedOpen = $state(untrack(() => open));

    function selectItem(item: ComboboxItem) {
        comboboxState.selected = item;
        comboboxState.activeValue = item.value;
        comboboxState.open = false;
        value = item.value;
        onValueChange?.(item.value);
        item.callback?.();
    }

    function clearSelection() {
        comboboxState.selected = undefined;
        comboboxState.activeValue = undefined;
        comboboxState.searchContent = '';
        comboboxState.results = new SvelteSet();
        value = '';
        onValueChange?.('');
    }

    setComboboxContext({ id: key, state: comboboxState, selectItem, clearSelection });

    $effect(() => {
        if (comboboxState.open && comboboxState.appearance !== 'input') {
            comboboxState.searchContent = '';
            comboboxState.activeValue = untrack(() => comboboxState.selected?.value);
        }
    });
    $effect(() => {
        if (open !== syncedOpen) {
            syncedOpen = open;
            comboboxState.open = open;
        }
    });
    $effect(() => {
        if (comboboxState.open !== syncedOpen) {
            syncedOpen = comboboxState.open;
            open = comboboxState.open;
        }
    });

    $effect(() => {
        const next = value;
        const selected = comboboxState.selected?.value;
        if (next === undefined || next === '') {
            if (selected !== undefined) {
                comboboxState.selected = undefined;
            }
            return;
        }
        if (selected === next) {
            return;
        }
        for (const item of comboboxState.items) {
            if (item.value === next) {
                comboboxState.selected = item;
                return;
            }
        }
    });
</script>

<Popover.Root
    {...rest}
    state_key={key}
    stateKey={key}
    bind:open={comboboxState.open}
    {onOpenChange}
>
    {@render children?.()}
</Popover.Root>
