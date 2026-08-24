<script lang="ts">
    import X from '@lucide/svelte/icons/x';
    import Button from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SheetHeaderProps } from '.';
    import { getSheetContext } from './context.svelte';

    let { class: className, children, ...rest }: SheetHeaderProps = $props();

    const { state: sheetState } = getSheetContext();
</script>

<div {...rest} class={cn(className, 'flex flex-col gap-1 pb-6')}>
    {@render children?.()}
    <Button
        onclick={() => {
            sheetState.open = false;
        }}
        class="absolute top-1.5 right-1.5 size-11 text-foreground-muted md:top-3 md:right-3 md:size-8"
        variant="ghost"
        aria-label="Close"
    >
        <X />
    </Button>
</div>
