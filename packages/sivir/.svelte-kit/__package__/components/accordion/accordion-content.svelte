<script lang="ts">
    import { themedSlide } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { AccordionContentProps, AccordionContext } from '.';

    let { class: className, children, ...rest }: AccordionContentProps = $props();
    const ctx = getContext<AccordionContext>('accordion');
    const item = getContext<{ value: string; disabled: boolean }>('accordion-item');
    const open = $derived(ctx.isOpen(item.value));
</script>

{#if open}
    <div
        id={`accordion-content-${item.value}`}
        role="region"
        aria-labelledby={`accordion-trigger-${item.value}`}
        data-ui="accordion-content"
        data-state="open"
        transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
        class={cn(
            className,
            'overflow-hidden [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted'
        )}
        {...rest}
    >
        <div class="pb-4">
            {@render children?.()}
        </div>
    </div>
{/if}
