<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ComposerActionsProps } from '.';
    import { getComposerContext } from './context.svelte';

    let { children, class: className, ...rest }: ComposerActionsProps = $props();
    const context = getComposerContext();
</script>

<div
    {...rest}
    data-ui="composer-actions"
    data-state={context.status}
    class={cn(className, 'flex min-w-0 flex-1 flex-wrap items-center gap-1')}
>
    {@render children?.()}
</div>
