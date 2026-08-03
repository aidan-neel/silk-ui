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

<p
    {...rest}
    class={cn(
        classProp,
        `m-0 [font-family:var(--font-header)] text-[0.95rem] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.01em)] text-balance leading-tight text-foreground` // token-lint-disable-line no-literal-length
    )}
>
    {@render children?.()}
</p>
