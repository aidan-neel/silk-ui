<script lang="ts">
import * as Popover from '@sivir-ui/svelte/components/popover';
import { untrack } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import type { ComboboxState } from '.';
import { setComboboxContext } from './context.svelte';

interface Props extends Popover.PopoverProps {}

let { children, state_key, open = $bindable(false), ...rest }: Props = $props();

const generatedKey = $props.id();
const key = untrack(() => state_key ?? generatedKey);
const comboboxState = $state<ComboboxState>({
    open: untrack(() => open),
    items: new SvelteSet(),
    results: new SvelteSet(),
    searchContent: '',
    searchPlacement: 'trigger',
    threshold: 0.28,
    activeValue: undefined
});
let syncedOpen = $state(untrack(() => open));
setComboboxContext({ id: key, state: comboboxState });

$effect(() => {
    if (comboboxState.open) {
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
</script>

<Popover.Root {...rest} state_key={key} bind:open={comboboxState.open}>
    {@render children?.()}
</Popover.Root>
