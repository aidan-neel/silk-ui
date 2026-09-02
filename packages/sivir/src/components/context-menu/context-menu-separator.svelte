<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ContextMenuSeparatorProps } from '.';

    let { children, class: className, ...rest }: ContextMenuSeparatorProps = $props();
</script>

<div {...rest} data-ui="menu-separator" class={cn(className, 'sivir-menu-separator')}>
    {@render children?.()}
</div>
