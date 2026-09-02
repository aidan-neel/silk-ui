<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { descriptionClasses } from '../typography/variants';
    import type { ModalDescriptionProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalDescriptionProps = $props();

    const modal = getModalContext();
</script>

<p {...rest} id={`${modal.id}-desc`} class={cn(className, descriptionClasses)}>
    {@render children?.()}
</p>
