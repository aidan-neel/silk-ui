<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';

    type Props = {
        children: Snippet;
        class?: string;
    };

    let props: Props = $props();
</script>

<p
    {...props}
    data-ui="menu-label"
    class={cn(
        props.class,
        'sivir-menu-label'
    )}
>
    {@render props.children?.()}
</p>
