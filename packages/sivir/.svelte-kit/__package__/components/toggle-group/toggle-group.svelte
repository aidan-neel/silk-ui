<script lang="ts">
    import { cn, travelingHighlight } from '@sivir-ui/svelte/utils';
    import { setContext } from 'svelte';
    import type { ToggleGroupContext, ToggleGroupProps } from '.';

    let {
        class: className,
        type = 'single',
        value = $bindable<string | string[] | undefined>(),
        disabled = false,
        onValueChange,
        children,
        ...rest
    }: ToggleGroupProps = $props();

    function isActive(itemValue: string) {
        if (type === 'multiple') {
            return Array.isArray(value) && value.includes(itemValue);
        }
        return value === itemValue;
    }

    function setValue(itemValue: string) {
        if (disabled) {
            return;
        }
        if (type === 'multiple') {
            const arr = Array.isArray(value) ? [...value] : [];
            const idx = arr.indexOf(itemValue);
            if (idx === -1) {
                arr.push(itemValue);
            } else {
                arr.splice(idx, 1);
            }
            value = arr;
            onValueChange?.(arr);
        } else {
            value = value === itemValue ? undefined : itemValue;
            onValueChange?.(value);
        }
    }

    const ctx: ToggleGroupContext = {
        get type() {
            return type;
        },
        get disabled() {
            return disabled;
        },
        isActive,
        setValue
    };
    setContext('toggle-group', ctx);
</script>

<div
    data-ui="toggle-group"
    role={type === 'single' ? 'radiogroup' : 'group'}
    use:travelingHighlight
    class={cn(className, 'inline-flex items-center gap-1')}
    {...rest}
>
    {@render children?.()}
</div>
