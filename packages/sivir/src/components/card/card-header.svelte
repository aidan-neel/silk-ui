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

<div {...rest} class={cn(classProp, `flex flex-col mb-6`)}>
    {@render children?.()}
</div>
