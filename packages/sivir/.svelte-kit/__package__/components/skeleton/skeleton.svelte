<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { type Snippet } from 'svelte';

    let {
        children,
        class: classProp,
        w: width,
        h: height,
        unit = 'px',
        ...rest
    }: {
        children?: Snippet;
        class?: string;
        w?: number;
        h?: number;
        unit?:
            | 'px'
            | 'rem'
            | 'em'
            | '%'
            | 'vh'
            | 'vw'
            | 'vmin'
            | 'vmax'
            | 'ch'
            | 'ex'
            | 'cm'
            | 'mm'
            | 'in'
            | 'pt'
            | 'pc';
    } = $props();
</script>

<!-- token-lint-disable-next-line -->
<div
    {...rest}
    class={cn(classProp, 'rounded-[var(--radius-md)] bg-secondary')}
    style:height={height == null ? undefined : `${height}${unit}`}
    style:width={width == null ? undefined : `${width}${unit}`}
>
    {@render children?.()}
</div>
