<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ColorPickerProps } from '.';
    import { setColorPickerContext } from './context';

    let {
        label,
        value = $bindable(''),
        onValueChange,
        options = [],
        format = 'hsl',
        class: className,
        children
    }: ColorPickerProps = $props();

    setColorPickerContext({
        get value() {
            return value;
        },
        get options() {
            return options;
        },
        get format() {
            return format;
        },
        apply: (hex) => {
            const next = hex.toLowerCase();
            value = next;
            onValueChange?.(next);
        }
    });
</script>

<div class={cn(className, 'space-y-1')}>
    {#if label}
        <p class="text-sm text-foreground-muted">{label}</p>
    {/if}

    <Popover.Root placement="bottom"> {@render children?.()} </Popover.Root>
</div>
