<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { AvatarImageProps } from '.';

    let { class: className, src, alt = '', ...rest }: AvatarImageProps = $props();

    const ctx = getContext<{ imageLoaded: boolean }>('avatar-state');
    let errored = $state(false);
</script>

{#if src && !errored}
    <img
        {src}
        {alt}
        onload={() => (ctx.imageLoaded = true)}
        onerror={() => {
            errored = true;
            ctx.imageLoaded = false;
        }}
        class={cn(
            className,
            'absolute inset-0 h-full w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10'
        )}
        {...rest}
    />
{/if}
