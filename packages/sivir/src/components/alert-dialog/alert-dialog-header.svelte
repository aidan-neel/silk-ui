<script lang="ts">
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';

    let { class: className, children, ...rest }: DefaultProps = $props();
</script>

<div {...rest} class={cn(className, 'flex flex-col gap-1.5')}>
    {@render children?.()}
</div>
