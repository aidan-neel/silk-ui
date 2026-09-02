<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';

    let {
        children,
        class: classProp,
        ...rest
    }: {
        children: Snippet;
        class?: string;
    } = $props();
</script>

<p
    {...rest}
    class={cn(
        classProp,
        `m-0 [font-family:var(--font-header)] text-[length:var(--font-size-header)] [font-weight:var(--font-weight-header)] [letter-spacing:var(--tracking-header)] text-balance leading-tight text-foreground`
    )}
>
    {@render children?.()}
</p>
