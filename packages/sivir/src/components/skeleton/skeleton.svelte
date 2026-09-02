<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SkeletonProps } from '.';

    let {
        children,
        class: classProp,
        w: width,
        h: height,
        unit = 'px',
        ...rest
    }: SkeletonProps = $props();
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
