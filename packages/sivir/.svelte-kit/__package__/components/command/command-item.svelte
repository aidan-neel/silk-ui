<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount, type Snippet } from 'svelte';
    import { getModalContext } from '../modal/context.svelte';
    import type { CommandItem } from '.';
    import { getCommandContext } from './context.svelte';

    const command = getCommandContext();
    const modal = getModalContext();
    const localId = $props.id();
    const itemId = `${command.id}-option-${localId}`;

    type Props = {
        class?: string;
        name: string;
        children?: Snippet;
        callback?: () => void;
        disabled?: boolean;
        href?: string;
        onclick?: () => void;
    };

    let {
        children,
        name,
        class: className,
        callback,
        disabled = false,
        href,
        onclick
    }: Props = $props();
    let el = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();
    const item = {
        id: itemId,
        get name() {
            return name;
        },
        get callback() {
            return callback;
        },
        get ref() {
            return el;
        },
        get disabled() {
            return disabled;
        }
    } as CommandItem;

    onMount(() => {
        command.items.push(item);
        command.results = [...command.items];
        command.itemsVersion += 1;
        command.activeId ??= command.items.find((candidate) => !candidate.disabled)?.id;

        return () => {
            command.items = command.items.filter((candidate) => candidate.id !== item.id);
            command.results = command.results.filter((candidate) => candidate.id !== item.id);
            command.itemsVersion += 1;
            if (command.activeId === item.id) {
                command.activeId = command.items.find((candidate) => !candidate.disabled)?.id;
            }
        };
    });

    function activate() {
        if (disabled) {
            return;
        }
        modal.state.open = false;
        callback?.();
        onclick?.();
    }

    const filteredOut = $derived(
        command.searchContent !== '' && !command.results.some((result) => result.id === item.id)
    );
</script>

<Button
    id={itemId}
    role="option"
    aria-selected={command.activeId === itemId}
    data-collection-item
    data-collection-active={command.activeId === itemId}
    tabindex={-1}
    bind:element={el}
    {disabled}
    {href}
    hidden={filteredOut}
    onmouseenter={() => {
        if (!disabled) {
            command.activeId = itemId;
        }
    }}
    onclick={activate}
    class={cn(className, 'sivir-menu-item justify-start gap-2')}
    unstyled
>
    <div class="flex w-full items-center gap-2 text-left">
        {@render children?.()}
    </div>
</Button>
