<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import X from '@lucide/svelte/icons/x';
    import type { PopoverTriggerProps } from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import Fuse from 'fuse.js';
    import { onMount, type Snippet, tick } from 'svelte';
    import { button } from '../button/variants';
    import { input } from '../input/variants';
    import { getPopoverContext } from '../popover/context.svelte';
    import type { ComboboxItem } from '.';
    import { getComboboxContext } from './context.svelte';

    const { id, state: comboboxState, selectItem, clearSelection } = getComboboxContext();
    const { state: popoverState } = getPopoverContext();

    type Props = Omit<PopoverTriggerProps, 'children'> & {
        trailing?: Snippet;
        placeholder?: string;
        searchPlacement?: 'trigger' | 'menu';
        threshold?: number;
        appearance?: 'button' | 'input';
    };
    let {
        trailing,
        class: className,
        placeholder = 'Select…',
        searchPlacement = 'trigger',
        threshold = 0.28,
        appearance = 'button',
        variant = 'outline',
        size = 'md',
        disabled = false,
        onclick,
        onopen,
        'aria-label': ariaLabel,
        ...rest
    }: Props = $props();

    const isInputAppearance = $derived(appearance === 'input');

    let triggerElement = $state<HTMLDivElement>();
    let inputElement = $state<HTMLInputElement>();

    $effect(() => {
        comboboxState.searchPlacement = searchPlacement;
        comboboxState.threshold = threshold;
        comboboxState.appearance = appearance;
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

    function runTriggerSearch(text: string) {
        comboboxState.searchContent = text;
        comboboxState.results = new Set<ComboboxItem>(
            fuse.search(text).map((result) => result.item)
        );
        comboboxState.activeValue = Array.from(comboboxState.results)[0]?.value;
    }

    function handleInput(event: Event) {
        if (searchPlacement === 'menu') {
            return;
        }
        if (isInputAppearance) {
            show();
        }
        runTriggerSearch((event.currentTarget as HTMLInputElement).value);
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

    function clearTriggerSearch() {
        comboboxState.searchContent = '';
        comboboxState.results = new Set<ComboboxItem>();
        comboboxState.activeValue = undefined;
    }

    function clearSearch() {
        clearSelection();
        show();
        void tick().then(() => {
            inputElement?.focus({ preventScroll: true });
        });
    }

    function seedTriggerSearch() {
        if (comboboxState.selected) {
            runTriggerSearch(comboboxState.selected.label);
        } else {
            clearTriggerSearch();
        }
    }

    function open() {
        if (disabled || comboboxState.open) {
            return;
        }
        if (isInputAppearance) {
            seedTriggerSearch();
        }
        onopen?.();
        comboboxState.open = true;
        onclick?.();
    }

    function show() {
        if (disabled || comboboxState.open) {
            return;
        }
        if (isInputAppearance) {
            seedTriggerSearch();
        }
        onopen?.();
        comboboxState.open = true;
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
            return;
        }
        if (event.key === 'Escape' && comboboxState.open) {
            event.preventDefault();
            comboboxState.open = false;
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
    data-appearance={appearance}
    class={cn(
        className,
        isInputAppearance
            ? input({ variant: variant === 'secondary' ? 'secondary' : 'outline' })
            : button({ variant, size }),
        'relative select-none',
        isInputAppearance
            ? 'items-center gap-2 focus-within:shadow-[var(--focus-ring)]'
            : 'focus-within:shadow-[var(--focus-ring),var(--elevation-button-outline)]',
        disabled && 'pointer-events-none opacity-40'
    )}
>
    <input
        bind:this={inputElement}
        {...rest}
        type="text"
        role="combobox"
        value={displayValue}
        readonly={searchPlacement === 'menu' || (!comboboxState.open && !isInputAppearance)}
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
            if (isInputAppearance) {
                show();
            } else {
                toggle();
            }
        }}
        onfocus={() => {
            if (isInputAppearance) {
                show();
            }
        }}
        oninput={handleInput}
        onkeydown={handleInputKeydown}
        class={cn(
            'min-w-0 flex-1 bg-transparent text-left text-[length:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] outline-none placeholder:text-foreground-muted',
            isInputAppearance ? 'h-auto cursor-text' : 'h-full cursor-[var(--ui-cursor-interactive)]',
            valueColor,
            trailing && !isInputAppearance && 'pr-5',
            (searchPlacement === 'menu' || (!comboboxState.open && !isInputAppearance)) &&
                'select-none'
        )}
    />
    {#if isInputAppearance && (comboboxState.searchContent !== '' || comboboxState.selected)}
        <button
            type="button"
            aria-label="Clear search"
            data-ui="combobox-trigger-clear"
            class="flex shrink-0 cursor-pointer items-center rounded-full text-foreground-muted transition-colors outline-none hover:text-foreground focus-visible:shadow-[var(--focus-ring)] [&_svg]:size-4 [&_svg]:shrink-0"
            onmousedown={(event) => event.preventDefault()}
            onclick={(event) => {
                event.stopPropagation();
                clearSearch();
            }}
        >
            <X size={16} aria-hidden="true" />
        </button>
    {:else if trailing}
        <span
            data-ui="combobox-trigger-trailing"
            class={cn(
                'flex shrink-0 items-center text-foreground-muted [&_svg]:size-4 [&_svg]:shrink-0',
                !isInputAppearance && 'absolute top-1/2 right-3 -translate-y-1/2'
            )}
            aria-hidden="true"
        >
            {@render trailing()}
        </span>
    {:else if !isInputAppearance}
        <ChevronDown
            size={18}
            class="pointer-events-none absolute top-1/2 right-3 shrink-0 -translate-y-1/2 text-foreground-muted"
            aria-hidden="true"
        />
    {/if}
</div>
