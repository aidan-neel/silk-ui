<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import type { PopoverTriggerProps } from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import Fuse from 'fuse.js';
    import { onMount, tick } from 'svelte';
    import { button } from '../button/variants';
    import { getPopoverContext } from '../popover/context.svelte';
    import type { ComboboxItem } from '.';
    import { getComboboxContext } from './context.svelte';

    const { id, state: comboboxState, selectItem } = getComboboxContext();
    const { state: popoverState } = getPopoverContext();

    type Props = Omit<PopoverTriggerProps, 'children'> & {
        placeholder?: string;
        searchPlacement?: 'trigger' | 'menu';
        threshold?: number;
    };
    let {
        class: className,
        placeholder = 'Select…',
        searchPlacement = 'trigger',
        threshold = 0.28,
        variant = 'outline',
        size = 'md',
        disabled = false,
        onclick,
        onopen,
        'aria-label': ariaLabel,
        ...rest
    }: Props = $props();

    let triggerElement = $state<HTMLDivElement>();
    let inputElement = $state<HTMLInputElement>();

    $effect(() => {
        comboboxState.searchPlacement = searchPlacement;
        comboboxState.threshold = threshold;
    });
    const fuse = $derived(
        new Fuse(Array.from(comboboxState.items), {
            keys: ['value', 'label'],
            threshold,
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
    const displayValue = $derived(
        searchPlacement === 'trigger' && comboboxState.open
            ? comboboxState.searchContent
            : (comboboxState.selected?.label ?? '')
    );
    const valueColor = $derived(
        (searchPlacement === 'trigger' && comboboxState.open) || comboboxState.selected
            ? 'text-foreground'
            : 'text-foreground-muted'
    );

    onMount(() => {
        popoverState.buttonRef = triggerElement ?? null;
    });

    function handleInput(event: Event) {
        if (searchPlacement === 'menu') {
            return;
        }
        comboboxState.searchContent = (event.currentTarget as HTMLInputElement).value;
        comboboxState.results = new Set<ComboboxItem>(
            fuse.search(comboboxState.searchContent).map((result) => result.item)
        );
        comboboxState.activeValue = Array.from(comboboxState.results)[0]?.value;
    }

    function toggle() {
        if (disabled) {
            return;
        }
        if (comboboxState.open) {
            comboboxState.open = false;
        } else {
            onopen?.();
            comboboxState.open = true;
        }
        onclick?.();
    }

    function open() {
        if (disabled || comboboxState.open) {
            return;
        }
        onopen?.();
        comboboxState.open = true;
        onclick?.();
    }

    function handleInputKeydown(event: KeyboardEvent) {
        const activeIndex = available.findIndex((item) => item.value === comboboxState.activeValue);
        if (
            event.key === 'ArrowDown' ||
            event.key === 'ArrowUp' ||
            event.key === 'Home' ||
            event.key === 'End'
        ) {
            event.preventDefault();
            if (!comboboxState.open) {
                open();
            }
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
        if (event.key === 'Enter' && comboboxState.open) {
            event.preventDefault();
            const active =
                available.find((item) => item.value === comboboxState.activeValue) ?? available[0];
            if (active) {
                selectItem(active);
            }
        }
    }

    $effect(() => {
        if (!comboboxState.open) {
            return;
        }
        if (searchPlacement === 'menu') {
            return;
        }
        void tick().then(() => {
            inputElement?.focus({ preventScroll: true });
            inputElement?.select();
        });
    });
</script>

<div
    bind:this={triggerElement}
    data-state={comboboxState.open ? 'open' : 'closed'}
    class={cn(
        className,
        button({ variant, size }),
        'relative select-none px-0 focus-within:shadow-[var(--focus-ring),var(--elevation-button-outline)]',
        disabled && 'pointer-events-none opacity-40'
    )}
>
    <input
        bind:this={inputElement}
        {...rest}
        type="text"
        role="combobox"
        value={displayValue}
        readonly={searchPlacement === 'menu' || !comboboxState.open}
        {disabled}
        placeholder={comboboxState.open || !comboboxState.selected ? placeholder : undefined}
        autocomplete="off"
        aria-label={ariaLabel ??
            (comboboxState.selected?.label
                ? `Selected ${comboboxState.selected.label}`
                : 'Open combobox')}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls={`combobox-${id}-listbox`}
        aria-expanded={comboboxState.open}
        aria-activedescendant={activeDescendant}
        onclick={(event) => {
            event.stopPropagation();
            toggle();
        }}
        oninput={handleInput}
        onkeydown={handleInputKeydown}
        class={cn(
            'h-full min-w-0 flex-1 cursor-[var(--ui-cursor-interactive)] bg-transparent text-left text-[length:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] outline-none placeholder:text-foreground-muted',
            valueColor,
            (searchPlacement === 'menu' || !comboboxState.open) && 'select-none'
        )}
    />
    <ChevronDown
        size={18}
        class="pointer-events-none absolute top-1/2 right-3 shrink-0 -translate-y-1/2 text-foreground-muted"
        aria-hidden="true"
    />
</div>
