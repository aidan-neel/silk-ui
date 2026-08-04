<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { ContextMenuSeparatorProps } from '.';

let { children, class: className, ...rest }: ContextMenuSeparatorProps = $props();
</script>

<div
    {...rest}
    data-ui="menu-separator"
    class={cn(className, 'mx-1 my-1 h-[var(--border-size)] rounded-[var(--radius-xl)] bg-border')}
>
    {@render children?.()}
</div>
