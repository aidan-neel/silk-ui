<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { ContextMenuSubContentProps } from '.';

    let { class: className, children, ...rest }: ContextMenuSubContentProps = $props();
</script>

<Popover.Content
    {...rest}
    role="menu"
    tabindex={-1}
    portal={false}
    data-ui="context-submenu-content"
    class={cn(className, 'min-w-44')}
    surfaceClass="p-0"
>
    <div use:travelingHighlight class="flex flex-col gap-0 p-1">
        {@render children?.()}
    </div>
</Popover.Content>
