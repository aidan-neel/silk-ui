<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { titleClasses } from '../typography/variants';

    let {
        children,
        class: classProp,
        ...rest
    }: {
        children: Snippet;
        class?: string;
    } = $props();
</script>

<h1
    {...rest}
    class={cn(
        classProp,
        'py-1',
        titleClasses
    )}
>
    {@render children?.()}
</h1>
