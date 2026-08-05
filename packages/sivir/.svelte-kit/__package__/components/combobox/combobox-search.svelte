<script lang="ts">
import Search from '@lucide/svelte/icons/search';
import Fuse from 'fuse.js';
import { tick } from 'svelte';
import type { ComboboxItem } from '.';
import { getComboboxContext } from './context.svelte';

const searchClass =
    'mx-1 mb-1 flex h-[calc(var(--size-control-sm)+var(--sivir-space-1))] shrink-0 items-center gap-2 rounded-[var(--radius-lg)] border border-transparent bg-secondary px-[var(--sivir-space-3)]'; // token-lint-disable-line no-primitive-leak
const { id, state: comboboxState } = getComboboxContext();

let inputElement = $state<HTMLInputElement>();
const fuse = $derived(
    new Fuse(Array.from(comboboxState.items), {
        keys: ['value', 'label'],
        threshold: comboboxState.threshold,
        ignoreLocation: true,
        minMatchCharLength: 1
    })
);
const available = $derived(
    comboboxState.searchContent
        ? Array.from(comboboxState.results)
        : Array.from(comboboxState.items)
);
const activeDescendant = $derived(
    available.find((item) => item.value === comboboxState.activeValue)?.id
);

function handleInput(event: Event) {
    comboboxState.searchContent = (event.currentTarget as HTMLInputElement).value;
    comboboxState.results = new Set<ComboboxItem>(
        fuse.search(comboboxState.searchContent).map((result) => result.item)
    );
    comboboxState.activeValue = Array.from(comboboxState.results)[0]?.value;
}

function handleKeydown(event: KeyboardEvent) {
    const activeIndex = available.findIndex((item) => item.value === comboboxState.activeValue);
    if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Home' ||
        event.key === 'End'
    ) {
        event.preventDefault();
        const index =
            event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? available.length - 1
                  : event.key === 'ArrowDown'
                    ? (activeIndex + 1 + available.length) % available.length
                    : (activeIndex - 1 + available.length) % available.length;
        const next = available[index];
        if (next) {
            comboboxState.activeValue = next.value;
            next.ref?.scrollIntoView({ block: 'nearest' });
        }
        return;
    }
    if (event.key === 'Enter') {
        event.preventDefault();
        const active =
            available.find((item) => item.value === comboboxState.activeValue) ?? available[0];
        if (active) {
            comboboxState.selected = active;
            comboboxState.open = false;
            active.callback?.();
        }
    }
}

$effect(() => {
    if (!comboboxState.open) {
        return;
    }
    void tick().then(() => {
        inputElement?.focus({ preventScroll: true });
    });
});
</script>

<div data-ui="combobox-search" data-variant="secondary" class={searchClass}>
    <Search
        size={15}
        strokeWidth={1.75}
        class="shrink-0 text-foreground-muted"
        aria-hidden="true"
    />
    <input
        bind:this={inputElement}
        type="text"
        role="combobox"
        value={comboboxState.searchContent}
        placeholder="Search…"
        autocomplete="off"
        aria-label="Search options"
        aria-autocomplete="list"
        aria-controls={`combobox-${id}-listbox`}
        aria-expanded={comboboxState.open}
        aria-activedescendant={activeDescendant}
        oninput={handleInput}
        onkeydown={handleKeydown}
        class="min-w-0 flex-1 bg-transparent text-[length:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground outline-none placeholder:text-foreground-muted"
    />
</div>
