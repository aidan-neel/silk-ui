<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { type ColorFormat, type ColorOption, setColorPickerContext } from './context';

    type Props = {
        label?: string;
        value: string;
        onValueChange?: (value: string) => void;
        options?: ColorOption[];
        /** Channel controls shown in the picker. Defaults to HSL. */
        format?: ColorFormat;
        class?: string;
        children: Snippet;
    };

    let {
        label,
        value,
        onValueChange,
        options = [],
        format = 'hsl',
        class: className,
        children
    }: Props = $props();

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
        apply: (hex) => onValueChange?.(hex.toLowerCase())
    });
</script>

<div class={cn(className, 'space-y-1')}>
    {#if label}
        <p class="text-sm text-foreground-muted">{label}</p>
    {/if}

    <Popover.Root placement="bottom"> {@render children()} </Popover.Root>
</div>
