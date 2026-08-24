<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalHeaderProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalHeaderProps = $props();
    const modal = getModalContext();
    const layoutClass = $derived(
        modal.state.orientation === 'horizontal'
            ? 'flex flex-row items-start gap-3'
            : 'flex flex-col gap-1.5'
    );
</script>

<div {...rest} data-orientation={modal.state.orientation} class={cn(className, layoutClass)}>
    {@render children?.()}
</div>
