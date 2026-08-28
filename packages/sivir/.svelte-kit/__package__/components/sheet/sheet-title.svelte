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
        `[font-family:var(--font-header)] [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] text-balance`
    )}
>
    {@render children?.()}
</h1>
