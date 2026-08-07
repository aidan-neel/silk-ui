<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';

    type SpinnerProps = {
        size?: number;
        ready?: boolean;
        class?: string;
        'aria-label'?: string;
        'aria-hidden'?: boolean | 'true' | 'false';
    };

    type SpinnerPhase = 'loading' | 'success' | 'exiting' | 'hidden';

    const successVisibleDuration = 2000;

    let {
        size = 16,
        ready = false,
        class: classProp,
        'aria-label': ariaLabel,
        'aria-hidden': ariaHidden
    }: SpinnerProps = $props();

    let indicator = $state<HTMLSpanElement>();
    let phase = $state<SpinnerPhase>('loading');
    let entered = $state(false);
    const showCheckmark = $derived(phase === 'success' || phase === 'exiting');
    const collapsed = $derived(!entered || phase === 'exiting');

    $effect(() => {
        if (!ready) {
            phase = 'loading';
            entered = false;
            const frame = requestAnimationFrame(() => {
                entered = true;
            });

            return () => {
                cancelAnimationFrame(frame);
            };
        }

        entered = true;
        phase = 'success';
        const timer = setTimeout(() => {
            phase = 'exiting';
        }, successVisibleDuration);

        return () => {
            clearTimeout(timer);
        };
    });

    $effect(() => {
        if (phase !== 'exiting') {
            return;
        }

        const duration = indicator
            ? getCssDuration(indicator, '--motion-duration-panel', 180)
            : 180;
        const timer = setTimeout(() => {
            phase = 'hidden';
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    });
</script>

{#if phase !== 'hidden'}
    <span
        bind:this={indicator}
        data-ui="spinner"
        data-phase={phase}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        class={cn(
            classProp,
            'relative inline-flex shrink-0 overflow-hidden transition-[width] duration-[var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none'
        )}
        style:height={`${size}px`}
        style:width={collapsed ? '0px' : `${size}px`}
    >
        <LoaderCircle
            {size}
            aria-hidden="true"
            class={`absolute inset-0 m-auto animate-spin transition-[filter,opacity,transform] duration-[var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:animate-none motion-reduce:transition-none ${
                showCheckmark || !entered
                    ? '-rotate-90 scale-75 opacity-0 blur-[2px]'
                    : 'rotate-0 scale-100 opacity-100 blur-0'
            }`}
        />
        <Check
            {size}
            aria-hidden="true"
            class={`absolute inset-0 m-auto transition-[filter,opacity,transform] duration-[var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none ${
                phase === 'exiting' || !entered
                    ? 'scale-75 opacity-0 blur-[2px]'
                    : showCheckmark
                      ? 'rotate-0 scale-100 opacity-100 blur-0'
                      : 'rotate-90 scale-75 opacity-0 blur-[2px]'
            }`}
        />
    </span>
{/if}
