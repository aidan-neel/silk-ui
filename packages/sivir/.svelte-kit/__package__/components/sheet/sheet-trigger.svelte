<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import type { SheetTriggerProps } from '.';
    import { getSheetContext } from './context.svelte';

    let {
        class: className,
        children,
        element = $bindable(),
        ...rest
    }: SheetTriggerProps = $props();

    const { id, state: sheetState } = getSheetContext();
</script>

<Button
    bind:element
    aria-haspopup="dialog"
    aria-expanded={sheetState.open}
    aria-controls={`sheet-${id}`}
    onclick={() => {
        sheetState.triggerRef = element;
        sheetState.open = !sheetState.open;
    }}
    class={className}
    {...rest}
>
    {@render children?.()}
</Button>
