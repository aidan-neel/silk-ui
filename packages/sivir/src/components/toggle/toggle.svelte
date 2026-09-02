<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import type { ToggleProps } from '.';
    import { toggle } from './variants';

    let {
        class: className,
        pressed = $bindable(false),
        disabled = false,
        size = 'md',
        variant = 'default',
        children,
        onPressedChange,
        ...rest
    }: ToggleProps = $props();

    const resolvedVariant = $derived(
        variant === 'outlined' || variant === 'outline' ? 'outlined' : 'default'
    );

    function togglePressed() {
        if (disabled) {
            return;
        }
        pressed = !pressed;
        onPressedChange?.(pressed);
    }
</script>

<button
    type="button"
    use:pressable
    data-ui="toggle"
    data-state={pressed ? 'on' : 'off'}
    aria-pressed={pressed}
    {disabled}
    onclick={togglePressed}
    class={cn(className, toggle({ variant: resolvedVariant, pressed, size }))}
    {...rest}
>
    {@render children?.()}
</button>
