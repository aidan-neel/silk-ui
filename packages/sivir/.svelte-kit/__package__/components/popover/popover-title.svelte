<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { PopoverTitleProps } from '.';
    import { getPopoverContext } from './context.svelte';

    const { id: key } = getPopoverContext();

    let { children, class: classProp, ...rest }: PopoverTitleProps = $props();
</script>

<p
    id={`popover-${String(key)}-title`}
    {...rest}
    class={cn(
        classProp,
        'text-foreground [font-family:var(--font-header)] [font-size:var(--font-size-header)] [font-weight:var(--font-weight-header)] [letter-spacing:var(--tracking-header)] text-balance'
    )}
>
    {@render children?.()}
</p>
