<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import type { ReasoningTriggerProps } from '.';
    import { getReasoningContext } from './context.svelte';

    let { title = 'Draft', duration, class: className, ...rest }: ReasoningTriggerProps = $props();
    const reasoning = getReasoningContext();
</script>

<button
    {...rest}
    type="button"
    use:pressable
    data-ui="reasoning-trigger"
    aria-expanded={reasoning.open}
    aria-controls={`reasoning-${reasoning.id}`}
    onclick={() => (reasoning.open = !reasoning.open)}
    class={cn(
        className,
        "sivir-press relative flex max-w-full flex-col items-start gap-0.5 text-left transition-[transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] after:absolute after:-inset-1.5 after:content-[''] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    )}
>
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
        <span class="max-w-full truncate text-primary">{title}</span>
    {/if}
</button>

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
