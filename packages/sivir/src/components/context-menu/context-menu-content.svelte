<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { ContextMenuContentProps } from '.';
    import { getContextMenuContext } from './context.svelte';

    const { state: contextMenuState } = getContextMenuContext();

    let { class: className, children, ...rest }: ContextMenuContentProps = $props();
</script>

<Popover.Content
    role="menu"
    tabindex={-1}
    data-ui="context-menu-content"
    refElement={contextMenuState.virtualElement}
    focusTrap={false}
    {...rest}
    class={className}
    surfaceClass="p-0"
>
    <div use:travelingHighlight class="flex flex-col gap-0 p-1">
        {@render children?.()}
    </div>
</Popover.Content>
