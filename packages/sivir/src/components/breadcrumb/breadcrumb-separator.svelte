<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { BreadcrumbSeparatorProps } from '.';

    let { class: className, children, ...rest }: BreadcrumbSeparatorProps = $props();
</script>

{#if children}
    {@render children?.()}
{:else}
    <ChevronRight {...rest} size={14} class={cn(className, `text-foreground-muted`)} />
{/if}
