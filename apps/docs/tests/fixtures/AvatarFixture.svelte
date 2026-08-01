<script lang="ts">
    import * as Avatar from '@sivir-ui/svelte/components/avatar';

    let {
        src = '',
        alt = '',
        size = 'md' as 'sm' | 'md' | 'lg' | 'xl',
        shape = 'circle' as 'circle' | 'square'
    } = $props();
</script>

<Avatar.Root {size} {shape}>
    {#if src}
        <Avatar.Image {src} {alt} />
    {/if}
    <Avatar.Fallback>
        <span data-testid="avatar-fallback">AB</span>
    </Avatar.Fallback>
</Avatar.Root>
