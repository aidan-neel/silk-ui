<script lang="ts">
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import { type Snippet, tick } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';

    const { state: popoverState } = getPopoverContext();

    type Props = {
        children: Snippet;
        class?: string;
        dynamic?: boolean;
    };

    let props: Props = $props();

    $effect(() => {
        if (!popoverState.open) {
            return;
        }

        void tick().then(() => {
            const content = popoverState.popoverRef;
            if (!content) {
                return;
            }

            const selected =
                content.querySelector<HTMLElement>('[role="option"][aria-selected="true"]') ??
                content.querySelector<HTMLElement>('[role="option"]');
            selected?.focus();
        });
    });

    function moveFocus(current: HTMLElement, direction: 1 | -1) {
        const options = Array.from(
            current
                .closest('[role="listbox"]')
                ?.querySelectorAll<HTMLElement>('[role="option"]:not(:disabled)') ?? []
        );
        const index = options.indexOf(current);
        options[(index + direction + options.length) % options.length]?.focus();
    }

    function handleKeydown(event: KeyboardEvent) {
        const target = event.target;
        if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'option') {
            return;
        }
        const listbox = target.closest('[role="listbox"]');
        if (!listbox) {
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            moveFocus(target, event.key === 'ArrowDown' ? 1 : -1);
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            const options = listbox.querySelectorAll<HTMLElement>('[role="option"]:not(:disabled)');
            options[event.key === 'Home' ? 0 : options.length - 1]?.focus();
        }
    }
</script>

<DropdownMenu.Content
    role="listbox"
    tabindex={-1}
    data-ui="select-content"
    class={props.class}
    dynamic={props.dynamic ?? false}
    onkeydown={handleKeydown}
>
    {@render props.children?.()}
</DropdownMenu.Content>
