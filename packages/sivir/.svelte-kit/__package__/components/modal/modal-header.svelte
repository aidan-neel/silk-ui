<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalHeaderProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalHeaderProps = $props();
    const modal = getModalContext();
</script>

<div
    {...rest}
    data-ui="modal-header"
    data-orientation={modal.state.orientation}
    class={cn(className, 'flex flex-col gap-1.5')}
>
    {@render children?.()}
</div>
