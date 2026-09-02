<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getCommandContext } from './context.svelte';

    const command = getCommandContext();

    type Props = {
        children?: Snippet;
        class?: string;
    };

    let { children, class: className, ...rest }: Props = $props();
</script>

{#if command.searchContent === ''}
    <div
        {...rest}
        data-ui="menu-separator"
        class={cn(
            className,
            'sivir-menu-separator mx-6'
        )}
    >
        {@render children?.()}
    </div>
{/if}
