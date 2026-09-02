<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolbarProps } from '.';

    let { children, class: classProp, ...rest }: ToolbarProps = $props();
</script>

<div
    data-ui="toolbar"
    role="toolbar"
    class={cn(classProp, 'flex flex-wrap items-center justify-between gap-1 p-1.5 text-foreground')}
    {...rest}
>
    {@render children?.()}
</div>
