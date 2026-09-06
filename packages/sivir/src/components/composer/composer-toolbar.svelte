<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ComposerToolbarProps } from '.';
    import { getComposerContext } from './context.svelte';

    let {
        children,
        class: className,
        'aria-label': ariaLabel = 'Message actions',
        ...rest
    }: ComposerToolbarProps = $props();

    const context = getComposerContext();
</script>

<div
    {...rest}
    data-ui="composer-toolbar"
    data-state={context.status}
    role="toolbar"
    aria-label={ariaLabel}
    class={cn(
        className,
        'flex min-h-10 min-w-0 flex-wrap items-center justify-between gap-2 px-2 py-1.5'
    )}
>
    {@render children?.()}
</div>
