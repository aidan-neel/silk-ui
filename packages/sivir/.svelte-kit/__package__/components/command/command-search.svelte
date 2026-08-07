<!-- token-lint-disable-file -->
<script lang="ts">
    import Search from '@lucide/svelte/icons/search';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount, tick } from 'svelte';
    import type { HTMLInputAttributes } from 'svelte/elements';
    import { getCommandContext, getCommandResults } from './context.svelte';
    import { DEFAULT_COMMAND_SEARCH_THRESHOLD, searchCommandItems } from './search';

    const command = getCommandContext();

    type Props = {
        threshold?: number;
    } & HTMLInputAttributes;

    let searchInput = $state<HTMLInputElement | undefined>();
    let searchTimeout: ReturnType<typeof setTimeout> | undefined;
    let resultsAnimation: Animation | undefined;
    let spoken = $state('');

    const {
        class: classProp,
        threshold = DEFAULT_COMMAND_SEARCH_THRESHOLD,
        ...rest
    }: Props = $props();

    onMount(() => {
        if (searchInput) {
            searchInput.focus();
        }

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            resultsAnimation?.cancel();
        };
    });

    async function updateResults(query: string) {
        searchTimeout = undefined;
        const resultsElement = document.getElementById(`${command.id}-listbox`);
        const startHeight = resultsElement?.getBoundingClientRect().height;
        resultsAnimation?.cancel();

        const q = query.trim();
        if (q === '') {
            command.results = [...command.items];
        } else {
            command.results = searchCommandItems(command.items, q, threshold);
        }
        command.activeId = getCommandResults(command)[0]?.id;

        if (!resultsElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        await tick();
        if (!resultsElement.isConnected) {
            return;
        }

        const endHeight = resultsElement.getBoundingClientRect().height;
        if (startHeight === undefined || startHeight === endHeight) {
            return;
        }

        const animation = resultsElement.animate(
            [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
            { duration: 125, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
        resultsAnimation = animation;
        animation.onfinish = animation.oncancel = () => {
            if (resultsAnimation === animation) {
                resultsAnimation = undefined;
            }
        };
    }

    function handleInput() {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(() => void updateResults(command.searchContent), 50);
    }

    function flushSearch() {
        if (!searchTimeout) {
            return;
        }
        clearTimeout(searchTimeout);
        void updateResults(command.searchContent);
    }

    function setActive(index: number) {
        const results = getCommandResults(command);
        if (results.length === 0) {
            return;
        }

        const item = results[(index + results.length) % results.length];
        command.activeId = item.id;
        item.ref?.scrollIntoView?.({ block: 'nearest' });
    }

    function handleKeydown(event: KeyboardEvent) {
        if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter'].includes(event.key)) {
            flushSearch();
        }
        const results = getCommandResults(command);
        const activeIndex = results.findIndex((item) => item.id === command.activeId);

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setActive(activeIndex + 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActive(activeIndex <= 0 ? results.length - 1 : activeIndex - 1);
                break;
            case 'Home':
                event.preventDefault();
                setActive(0);
                break;
            case 'End':
                event.preventDefault();
                setActive(results.length - 1);
                break;
            case 'Enter': {
                const active = results.find((item) => item.id === command.activeId) ?? results[0];
                if (!active) {
                    return;
                }
                event.preventDefault();
                active.ref?.click();
                break;
            }
        }
    }

    $effect(() => {
        const count = getCommandResults(command).length;
        const timer = setTimeout(() => {
            spoken =
                count === 0
                    ? 'No command matches.'
                    : `${count} ${count === 1 ? 'command' : 'commands'} available.`;
        }, 400);
        return () => clearTimeout(timer);
    });
</script>

<div class="flex h-11 w-full items-center gap-2.5 border-b border-border px-3">
    <Search size={15} strokeWidth={1.75} class="shrink-0 text-foreground-muted" />
    <input
        bind:this={searchInput}
        bind:value={command.searchContent}
        oninput={handleInput}
        onkeydown={handleKeydown}
        class={cn(
            classProp,
            'min-w-0 flex-1 bg-transparent text-[length:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground placeholder:text-foreground-muted focus-visible:outline-none'
        )}
        placeholder="Type a command or search..."
        aria-label="Search commands"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
        aria-controls={`${command.id}-listbox`}
        aria-activedescendant={command.activeId}
        {...rest}
    />
    <span
        class="min-w-[3ch] text-right font-mono text-[10.5px] tabular-nums text-foreground-muted"
        aria-hidden="true"
    >
        {getCommandResults(command).length}
    </span>
    <span role="status" aria-live="polite" class="sr-only">{spoken}</span>
</div>
