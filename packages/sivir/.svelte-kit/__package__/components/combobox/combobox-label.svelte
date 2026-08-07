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
        'px-2 py-1 text-[length:var(--text-xs)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted select-none'
    )}
>
    {@render props.children?.()}
</p>
