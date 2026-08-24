<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalConfirmProps } from '.';
    import { getModalContext } from './context.svelte';

    const modal = getModalContext();
    let { class: className, children, onclick, variant, ...rest }: ModalConfirmProps = $props();
    const confirmVariant = $derived(variant ?? (modal.state.error ? 'destructive' : 'primary'));
    const actionWidthClass = $derived(
        modal.state.orientation === 'vertical' ? 'w-full sm:flex-1' : 'w-full sm:w-fit'
    );
</script>

<Button
    {...rest}
    variant={confirmVariant}
    onclick={(event: MouseEvent) => {
        modal.state.open = false;
        onclick?.(event);
    }}
    class={cn(className, 'flex flex-row items-center justify-center gap-2', actionWidthClass)}
>
    {@render children?.()}
</Button>
