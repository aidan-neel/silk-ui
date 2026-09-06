<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
    import { cn, dynamicWidth, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getDropdownMenuContext } from './context.svelte';

    const { inverted } = getDropdownMenuContext();
    const INVERTED_MENU =
        '[--color-panel:hsl(0_0%_13%)] [--color-border:rgb(255_255_255/0.1)] [--color-foreground:hsl(0_0%_96%)] [--color-foreground-muted:hsl(0_0%_72%)] [--color-accent-tint:rgb(255_255_255/0.12)]';

    type Props = {
        children: Snippet;
        class?: string;
        dynamic?: boolean;
    } & Omit<Popover.PopoverContentProps, 'children' | 'class' | 'surfaceClass'>;

    let { children, class: className, dynamic = false, role = 'menu', ...rest }: Props = $props();
</script>

<Popover.Content
    {...rest}
    {role}
    tabindex={-1}
    focusTrap={false}
    lockScroll={false}
    data-ui="dropdown-menu-content"
    class={cn(className, 'min-w-[var(--popover-trigger-width)] w-max', inverted && INVERTED_MENU)}
    surfaceClass="flex min-h-0 flex-col overflow-hidden p-0"
>
    <div
        use:travelingHighlight
        use:dynamicWidth={{ enabled: dynamic }}
        class="flex min-h-0 min-w-0 flex-1 flex-col p-1"
    >
        <ScrollArea class={cn(className, 'min-h-0 min-w-0 flex-1')}>
            {@render children?.()}
        </ScrollArea>
    </div>
</Popover.Content>
