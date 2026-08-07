<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalFooterProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalFooterProps = $props();
    const modal = getModalContext();
    const layoutClass = $derived(
        modal.state.orientation === 'horizontal'
            ? 'flex w-full flex-col-reverse justify-end gap-2 sm:flex-row sm:items-center'
            : 'flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center'
    );
</script>

<div {...rest} data-orientation={modal.state.orientation} class={cn(className, layoutClass)}>
    {@render children?.()}
</div>
