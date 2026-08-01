<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { setContext } from 'svelte';
    import type { AvatarProps } from '.';
    import { avatar } from './variants';

    let {
        class: className,
        size = 'md',
        shape = 'circle',
        children,
        ...rest
    }: AvatarProps = $props();

    /** Shared state lets `<Avatar.Image>` hide the fallback when its image loads. */
    const ctx = $state({ imageLoaded: false });
    setContext('avatar-state', ctx);
</script>

<span data-ui="avatar" class={cn(className, avatar({ size, shape }))} {...rest}>
    {@render children?.()}
</span>
