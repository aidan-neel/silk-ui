<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ReasoningTriggerProps } from '.';
    import { getReasoningContext } from './context.svelte';

    let {
        title = 'Draft',
        duration,
        children,
        class: className,
        ...rest
    }: ReasoningTriggerProps = $props();
    const reasoning = getReasoningContext();
</script>

<Button
    {...rest}
    type="button"
    variant="quiet"
    data-ui="reasoning-trigger"
    aria-expanded={reasoning.open}
    aria-controls={`reasoning-${reasoning.id}`}
    onclick={() => (reasoning.open = !reasoning.open)}
    class={cn(
        className,
        "relative flex h-auto max-w-full flex-col items-start justify-start gap-1.5 rounded-none px-0 text-left after:absolute after:-inset-1.5 after:content-['']"
    )}
>
    {#if children}
        {@render children({ open: reasoning.open, streaming: reasoning.streaming })}
    {:else}
        <span class="flex items-center gap-1">
            <span
                class={cn(
                    'font-[var(--font-weight-label)]',
                    reasoning.streaming ? 'sivir-reasoning-shimmer' : 'text-foreground-muted'
                )}
                >{reasoning.streaming ? 'Thinking' : 'Thought'}</span
            >
            {#if !reasoning.streaming && duration}
                <span class="text-foreground-muted">for {duration}</span>
            {/if}
            <ChevronDown
                size={14}
                aria-hidden="true"
                class={cn(
                    'shrink-0 text-foreground-muted transition-transform [transition-duration:var(--motion-duration-hover)]',
                    reasoning.open && 'rotate-180'
                )}
            />
        </span>
        {#if !reasoning.open}
            <span class="max-w-full text-pretty">{title}</span>
        {/if}
    {/if}
</Button>

<style>
    .sivir-reasoning-shimmer {
        background: linear-gradient(
            100deg,
            var(--color-foreground-muted) 35%,
            var(--color-foreground) 50%,
            var(--color-foreground-muted) 65%
        );
        background-size: 200% 100%;
        background-clip: text;
        color: transparent;
        animation: sivir-reasoning-shimmer 1.6s linear infinite;
    }

    @keyframes sivir-reasoning-shimmer {
        from {
            background-position: 200% 0;
        }
        to {
            background-position: -200% 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-reasoning-shimmer {
            animation: none;
            background: none;
            color: var(--color-foreground-muted);
        }
    }
</style>
