<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import { themedSlide } from '@sivir-ui/svelte/transition';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import type { ToolProps } from '.';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    let {
        name,
        duration,
        state = 'running',
        variant = 'default',
        open = $bindable(true),
        onOpenChange,
        onOpenChangeComplete,
        trigger,
        children,
        class: className,
        ...rest
    }: ToolProps = $props();

    const id = $props.id();
    const label = $derived(
        state === 'running'
            ? 'Task running'
            : state === 'complete'
              ? 'Task completed'
              : 'Task failed'
    );
    let initialized = false;
    let previousOpen = open;
    let revision = 0;
    let pending: { open: boolean; revision: number } | undefined;
    let transitionRevision = 0;

    function complete(nextOpen: boolean, completedRevision: number) {
        if (pending?.open !== nextOpen || pending.revision !== completedRevision) {
            return;
        }
        pending = undefined;
        if (nextOpen) {
            onOpenChangeComplete?.(true);
            return;
        }
        queueMicrotask(() => {
            if (!pending) {
                onOpenChangeComplete?.(false);
            }
        });
    }

    $effect(() => {
        if (!initialized) {
            initialized = true;
            previousOpen = open;
            return;
        }
        if (open === previousOpen) {
            return;
        }
        previousOpen = open;
        revision += 1;
        pending = { open, revision };
        onOpenChange?.(open);
        if (!open) {
            return;
        }
        const completion = pending;
        queueMicrotask(() => {
            if (pending === completion && !open) {
                complete(completion.open, completion.revision);
            }
        });
    });
</script>

<section
    data-ui="tool"
    data-state={state}
    data-variant={variant}
    aria-busy={state === 'running'}
    class={cn(
        className,
        variant === 'quiet'
            ? 'inline-block max-w-full text-sm text-foreground'
            : 'w-full max-w-full text-sm text-foreground'
    )}
    {...rest}
>
    <button
        type="button"
        use:pressable
        aria-expanded={open}
        aria-controls={`tool-${id}`}
        onclick={() => (open = !open)}
        class={cn(
            'sivir-press flex min-h-8 w-full items-center gap-1.5 text-left transition-[background-color,color,transform,scale] [transition-duration:var(--motion-duration-hover),var(--motion-duration-press)] ease-[var(--ease-press)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
            variant === 'quiet'
                ? 'min-h-6 w-auto max-w-full px-0 py-0 text-foreground hover:bg-transparent'
                : 'rounded-[var(--radius-md)] px-3 py-1.5 hover:bg-secondary/60'
        )}
    >
        {#if trigger}
            {@render trigger({ open, state, name, duration })}
        {:else}
            <ChevronDown
                size={14}
                aria-hidden="true"
                class={`shrink-0 text-foreground-muted transition-transform [transition-duration:var(--motion-duration-hover)] ${open ? '' : '-rotate-90'}`}
            />
            {#if state === 'running'}
                <Spinner size={14} aria-hidden="true" class="text-foreground-muted" />
            {/if}
            <span
                class={cn(
                    variant === 'quiet' ? 'text-current' : 'text-foreground',
                    state === 'complete' && 'font-[var(--font-weight-label)]',
                    state === 'running' && 'sivir-tool-running'
                )}>{label}</span
            >
            <span class="min-w-0 flex-1 truncate text-foreground-muted">{name}</span>
            {#if duration}
                <span class="ml-2 shrink-0 font-mono text-xs tabular-nums text-foreground-muted"
                    >{duration}</span
                >
            {/if}
        {/if}
    </button>
    {#if open}
        <div
            id={`tool-${id}`}
            transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
            onintrostart={() => {
                transitionRevision = pending?.revision ?? revision;
            }}
            onintroend={() => {
                complete(true, transitionRevision);
            }}
            onoutrostart={() => {
                transitionRevision = pending?.revision ?? revision;
            }}
            onoutroend={() => {
                complete(false, transitionRevision);
            }}
            class={cn(
                'mt-1 flex flex-col gap-1.5 pb-1',
                variant === 'quiet' ? 'ml-0 px-0' : 'ml-5 px-3'
            )}
        >
            {@render children?.()}
        </div>
    {/if}
</section>

<style>
    .sivir-tool-running {
        background: linear-gradient(
            110deg,
            var(--color-foreground-muted) 35%,
            var(--color-foreground) 50%,
            var(--color-foreground-muted) 65%
        );
        background-size: 200% 100%;
        background-clip: text;
        color: transparent;
        animation: sivir-tool-shimmer 1.6s linear infinite;
    }

    @keyframes sivir-tool-shimmer {
        from {
            background-position: 200% 0;
        }
        to {
            background-position: -200% 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-tool-running {
            animation: none;
            background: none;
            color: var(--color-foreground);
        }
    }
</style>
