<script lang="ts">
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';
    import { getModalContext } from '../modal/context.svelte';
    import { descriptionClasses } from '../typography/variants';

    let { class: className, children, ...rest }: DefaultProps = $props();

    const modal = getModalContext();
</script>

<p {...rest} id={`${modal.id}-desc`} class={cn(className, descriptionClasses)}>
    {@render children?.()}
</p>
