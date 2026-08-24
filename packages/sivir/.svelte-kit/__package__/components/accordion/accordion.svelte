<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { setContext } from 'svelte';
    import type { AccordionContext, AccordionProps } from '.';

    let {
        class: className,
        type = 'single',
        value = $bindable<string | string[] | undefined>(),
        collapsible = true,
        onValueChange,
        children,
        ...rest
    }: AccordionProps = $props();

    function isOpen(itemValue: string) {
        if (type === 'multiple') {
            return Array.isArray(value) && value.includes(itemValue);
        }
        return value === itemValue;
    }

    function toggle(itemValue: string) {
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
            if (value === itemValue) {
                if (collapsible) {
                    value = undefined;
                    onValueChange?.(undefined);
                }
            } else {
                value = itemValue;
                onValueChange?.(itemValue);
            }
        }
    }

    const ctx: AccordionContext = { isOpen, toggle };
    setContext('accordion', ctx);
</script>

<div
    data-ui="accordion"
    data-type={type}
    class={cn(className, 'divide-y divide-border border-y border-border')}
    {...rest}
>
    {@render children?.()}
</div>
