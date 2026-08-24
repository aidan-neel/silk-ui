<script lang="ts">
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';
    import type { HTMLAttributes } from 'svelte/elements';

    let {
        children,
        class: classProp,
        ...rest
    }: DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> = $props();
</script>

<div
    data-ui="toolbar"
    role="toolbar"
    class={cn(classProp, 'flex flex-wrap items-center justify-between gap-1 p-1.5 text-foreground')}
    {...rest}
>
    {@render children?.()}
</div>
