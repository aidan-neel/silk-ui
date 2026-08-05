<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import { type Snippet } from 'svelte';

let {
    children,
    class: classProp,
    ...rest
}: {
    children: Snippet;
    class?: string;
} = $props();
</script>

<h4
    {...rest}
    class={cn(
        classProp,
        'm-0 [font-family:var(--font-header)] [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.01em)] text-balance leading-tight text-foreground'
    )}
>
    {@render children?.()}
</h4>
