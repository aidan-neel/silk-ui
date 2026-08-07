<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { AvatarFallbackProps } from '.';

    let { class: className, children, ...rest }: AvatarFallbackProps = $props();
    const ctx = getContext<{ imageLoaded: boolean }>('avatar-state');
</script>

{#if !ctx.imageLoaded}
    <span class={cn(className, 'flex h-full w-full items-center justify-center')} {...rest}>
        {@render children?.()}
    </span>
{/if}
