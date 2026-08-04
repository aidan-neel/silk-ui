<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { CodeBlockActionsProps } from '.';
import Copy from './code-block-copy.svelte';

let { children, class: className, copy = true, ...rest }: CodeBlockActionsProps = $props();
</script>

<!-- `ml-auto` pins the action cluster to the right edge of the header. -->
<div
    data-ui="code-block-actions"
    class={cn(
        className,
        'ml-auto flex items-center gap-0.5 py-1.5 text-[var(--color-foreground-muted)]'
    )}
    {...rest}
>
    {@render children?.()}
    {#if copy}
        <Copy />
    {/if}
</div>
