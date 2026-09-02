<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SheetTitleProps } from '.';
    import { getSheetContext } from './context.svelte';

    let { class: className, children, ...rest }: SheetTitleProps = $props();
    const { id } = getSheetContext();
</script>

<h1
    {...rest}
    id={`${id}-title`}
    class={cn(
        className,
        `[font-family:var(--font-header)] [font-size:var(--font-size-header)] [font-weight:var(--font-weight-header)] [letter-spacing:var(--tracking-header)] text-balance`
    )}
>
    {@render children?.()}
</h1>
