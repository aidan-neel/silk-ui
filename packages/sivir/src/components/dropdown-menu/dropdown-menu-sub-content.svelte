<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { dynamicWidth, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';

    type Props = {
        children: Snippet;
        class?: string;
        dynamic?: boolean;
    };

    let props: Props = $props();
</script>

<Popover.Content
    role="menu"
    tabindex={-1}
    data-ui="dropdown-submenu-content"
    class={props.class}
    surfaceClass="p-0"
>
    <div
        use:travelingHighlight
        use:dynamicWidth={{ enabled: props.dynamic ?? false }}
        class="flex flex-col gap-0 p-1"
    >
        {@render props.children?.()}
    </div>
</Popover.Content>
