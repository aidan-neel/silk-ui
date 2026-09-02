<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ContextMenuSubTriggerProps } from '.';

    let {
        class: className,
        children,
        inset = false,
        ...rest
    }: ContextMenuSubTriggerProps = $props();
</script>

<Popover.Trigger
    {...rest}
    role="menuitem"
    aria-haspopup="menu"
    data-collection-item
    class={cn(className, 'sivir-menu-item', inset && 'pl-8')}
    unstyled
>
    <span class="min-w-0 flex-1 text-left"> {@render children?.()} </span>
    <ChevronRight class="ml-2 shrink-0 text-foreground-muted" size={18} />
</Popover.Trigger>
