<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';

    type Props = {
        children: Snippet;
        class?: string;
    };

    let { children, class: className, ...rest }: Props = $props();
</script>

<p
    {...rest}
    data-ui="menu-label"
    class={cn(
        className,
        'sivir-menu-label'
    )}
>
    {@render children?.()}
</p>
