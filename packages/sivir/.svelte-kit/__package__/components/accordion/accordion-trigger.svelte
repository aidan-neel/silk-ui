<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { AccordionContext, AccordionTriggerProps } from '.';

    let { class: className, children, ...rest }: AccordionTriggerProps = $props();

    const ctx = getContext<AccordionContext>('accordion');
    const item = getContext<{ value: string; disabled: boolean }>('accordion-item');
    const open = $derived(ctx.isOpen(item.value));
</script>

<button
    type="button"
    use:pressable
    data-ui="accordion-trigger"
    data-state={open ? 'open' : 'closed'}
    aria-expanded={open}
    aria-controls={`accordion-content-${item.value}`}
    id={`accordion-trigger-${item.value}`}
    disabled={item.disabled}
    onclick={() => ctx.toggle(item.value)}
    class={cn(
        className,
        'sivir-press flex w-full items-center justify-between gap-3 py-4 text-left text-[length:var(--font-size-header)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] text-foreground transition-[color,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]'
    )}
    {...rest}
>
    {@render children?.()}
    <ChevronDown
        size={16}
        class={cn(
            'shrink-0 text-foreground-muted transition-transform [transition-duration:var(--motion-duration-panel)] ease-out',
            open && 'rotate-180'
        )}
    />
</button>
