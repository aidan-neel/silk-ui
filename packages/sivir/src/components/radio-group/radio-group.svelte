<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { setContext } from 'svelte';
    import type { RadioGroupContext, RadioGroupProps } from '.';

    let {
        class: className,
        value = $bindable<string | undefined>(),
        name,
        disabled = false,
        onValueChange,
        children,
        ...rest
    }: RadioGroupProps = $props();

    function isSelected(itemValue: string) {
        return value === itemValue;
    }
    function setValue(itemValue: string) {
        if (disabled) {
            return;
        }
        value = itemValue;
        onValueChange?.(itemValue);
    }

    const ctx: RadioGroupContext = {
        get name() {
            return name;
        },
        get disabled() {
            return disabled;
        },
        isSelected,
        setValue
    };
    setContext('radio-group', ctx);
</script>

<div
    data-ui="radio-group"
    role="radiogroup"
    aria-disabled={disabled || undefined}
    class={cn(className, 'grid gap-2')}
    {...rest}
>
    {@render children?.()}
</div>
