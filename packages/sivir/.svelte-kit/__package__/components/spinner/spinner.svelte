<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';

    import type { SpinnerProps } from '.';

    type SpinnerPhase = 'loading' | 'success' | 'exiting' | 'hidden';

    const successVisibleDuration = 2000;

    let {
        size = 16,
        ready = false,
        speed = 1,
        curved = false,
        class: classProp,
        'aria-label': ariaLabel,
        'aria-hidden': ariaHidden
    }: SpinnerProps = $props();

    let indicator = $state<HTMLSpanElement>();
    let phase = $state<SpinnerPhase>('loading');
    let entered = $state(false);
    const spinDuration = $derived(`${850 / (speed > 0 ? speed : 1)}ms`);
    const showCheckmark = $derived(phase === 'success' || phase === 'exiting');
    const collapsed = $derived(!entered || phase === 'exiting');
    const loaderBlur = $derived(showCheckmark || !entered ? 'blur(2px)' : 'blur(0px)');
    const checkBlur = $derived(
        phase === 'exiting' || !entered || !showCheckmark ? 'blur(2px)' : 'blur(0px)'
    );

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
            class={`absolute inset-0 m-auto ${curved ? 'animate-[sivir-spinner-spin_linear_infinite]' : 'animate-spin'} transition-[filter,opacity,transform] duration-[var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:animate-none motion-reduce:transition-none ${
                showCheckmark || !entered
                    ? '-rotate-90 scale-75 opacity-0'
                    : 'rotate-0 scale-100 opacity-100'
            }`}
            style={`filter: ${loaderBlur}; animation-duration: ${spinDuration};`}
        />
        <Check
            {size}
            aria-hidden="true"
            class={`absolute inset-0 m-auto transition-[filter,opacity,transform] duration-[var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none ${
                phase === 'exiting' || !entered
                    ? 'scale-75 opacity-0'
                    : showCheckmark
                      ? 'rotate-0 scale-100 opacity-100'
                      : 'rotate-90 scale-75 opacity-0'
            }`}
            style={`filter: ${checkBlur};`}
        />
    </span>
{/if}

<style>
    :global {
        @keyframes sivir-spinner-spin {
            0% {
                rotate: 0deg;
            }
            12.5% {
                rotate: 36.9deg;
            }
            25% {
                rotate: 78.5deg;
            }
            37.5% {
                rotate: 126.9deg;
            }
            50% {
                rotate: 180deg;
            }
            62.5% {
                rotate: 233.1deg;
            }
            75% {
                rotate: 281.5deg;
            }
            87.5% {
                rotate: 323.1deg;
            }
            100% {
                rotate: 360deg;
            }
        }
    }
</style>
