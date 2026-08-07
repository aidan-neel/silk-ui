<script lang="ts">
    import { ChevronRight } from '@lucide/svelte';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy, type Snippet } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import { getDropdownMenuContext } from './context.svelte';

    type SubTriggerProps = {
        class?: string;
        children?: Snippet;
    } & Omit<Popover.PopoverTriggerProps, 'children' | 'class'>;

    let { class: className, children, ...rest }: SubTriggerProps = $props();
    const menu = getDropdownMenuContext();
    const { state } = getPopoverContext();

    menu.parentSubmenus?.push(state);
    onDestroy(() => {
        const index = menu.parentSubmenus?.indexOf(state) ?? -1;
        if (index !== -1) {
            menu.parentSubmenus?.splice(index, 1);
        }
    });

    function closeSiblings() {
        for (const sibling of menu.parentSubmenus ?? []) {
            if (sibling === state) {
                continue;
            }
            if (sibling.closeTimeout) {
                clearTimeout(sibling.closeTimeout);
            }
            sibling.closeTimeout = undefined;
            sibling.open = false;
        }
    }
</script>

<Popover.Trigger
    {...rest}
    role="menuitem"
    aria-haspopup="menu"
    data-collection-item
    class={cn(className, 'sivir-menu-item')}
    unstyled
    onopen={closeSiblings}
>
    <span class="min-w-0 flex-1 text-left"> {@render children?.()} </span>
    <ChevronRight class="ml-2 shrink-0 text-foreground-muted" size={18} />
</Popover.Trigger>
