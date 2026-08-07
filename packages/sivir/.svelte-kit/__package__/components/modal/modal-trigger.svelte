<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import type { ModalTriggerProps } from '.';
    import { getModalContext } from './context.svelte';

    let {
        class: className,
        children,
        element = $bindable(),
        onclick,
        ...rest
    }: ModalTriggerProps = $props();

    const modal = getModalContext();
</script>

<Button
    bind:element
    aria-haspopup="dialog"
    aria-expanded={modal.state.open}
    aria-controls={modal.contentId}
    onclick={(event: MouseEvent) => {
        modal.returnFocusEl = element;
        modal.state.open = true;
        onclick?.(event);
    }}
    class={className}
    {...rest}
>
    {@render children?.()}
</Button>
