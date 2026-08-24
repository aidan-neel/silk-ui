<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { setContext } from 'svelte';
    import type { AccordionItemProps } from '.';

    let {
        class: className,
        value,
        disabled = false,
        children,
        ...rest
    }: AccordionItemProps = $props();
    /**
     * Getters, so trigger and content see the current prop values reactively
     * instead of the initial-mount snapshot.
     */
    setContext('accordion-item', {
        get value() {
            return value;
        },
        get disabled() {
            return disabled;
        }
    });
</script>

<div
    data-ui="accordion-item"
    data-value={value}
    data-disabled={disabled ? '' : undefined}
    class={cn(className, 'group')}
    {...rest}
>
    {@render children?.()}
</div>
