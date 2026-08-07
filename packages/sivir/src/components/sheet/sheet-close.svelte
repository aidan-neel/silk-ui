<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import type { SheetCloseProps } from '.';
    import { getSheetContext } from './context.svelte';

    let { class: className, children, ...rest }: SheetCloseProps = $props();

    const { state: sheetState } = getSheetContext();
</script>

<Button
    variant="outline"
    onclick={() => {
        sheetState.open = false;
    }}
    class={className}
    {...rest}
>
    {@render children?.()}
</Button>
