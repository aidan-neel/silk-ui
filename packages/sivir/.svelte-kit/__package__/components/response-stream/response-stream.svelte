<script lang="ts">
    import type { ScrittoProps } from '@scritto/core';
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy, type Component } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ResponseStreamProps } from '.';

    let {
        textStream,
        streaming = false,
        speed = 20,
        characterChunkSize,
        onComplete,
        onError,
        as = 'span',
        class: className,
        ...rest
    }: ResponseStreamProps = $props();

    let displayedText = $state('');
    let isComplete = $state(false);
    let isWaiting = $state(false);
    let currentIndex = 0;
    let streamId = 0;
    let sourceKind: 'static' | 'snapshot' | 'finalized-snapshot' | 'async' | undefined;
    let previousSource: string | AsyncIterable<string> | undefined;
    let previousSnapshot = '';
    let animationFrame: number | undefined;
    let abortController: AbortController | undefined;

    type ScrittoComponent = Component<ScrittoProps & HTMLAttributes<HTMLElement>>;
    let Scritto = $state<ScrittoComponent | null>(null);

    const canRoll =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        typeof Element !== 'undefined' &&
        typeof Element.prototype.getAnimations === 'function';

    const rollTransition = $derived({
        duration: getRollDuration(),
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
    });

    $effect(() => {
        if (!canRoll) {
            return;
        }
        let cancelled = false;
        import('@scritto/svelte').then((module) => {
            if (!cancelled) {
                Scritto = module.default as ScrittoComponent;
            }
        });

        return () => {
            cancelled = true;
        };
    });

    let box: HTMLElement | undefined;

    $effect(() => {
        const el = box;
        if (!el || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        let target = el.offsetHeight;
        let flight: Animation | undefined;
        const settle = () => {
            const grown = el.scrollHeight;
            if (grown === target) {
                flight = undefined;
                el.style.overflow = '';
                return;
            }
            play(Math.round(el.getBoundingClientRect().height), grown);
        };
        const play = (from: number, to: number) => {
            if (from === to) {
                return;
            }
            target = to;
            flight?.cancel();
            el.style.overflow = 'hidden';
            const animation = el.animate([{ height: `${from}px` }, { height: `${to}px` }], {
                duration: getCssDuration(el, '--motion-duration-panel', 180),
                easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
            });
            flight = animation;
            animation.onfinish = settle;
            animation.oncancel = () => {
                if (flight === animation) {
                    flight = undefined;
                }
            };
        };
        const observer = new ResizeObserver(() => {
            if (flight) {
                return;
            }
            const height = el.offsetHeight;
            if (height === target) {
                return;
            }
            play(target, height);
        });
        observer.observe(el);

        return () => {
            observer.disconnect();
            flight?.cancel();
            flight = undefined;
            el.style.overflow = '';
        };
    });

    function getChunkSize() {
        if (typeof characterChunkSize === 'number') {
            return Math.max(1, characterChunkSize);
        }
        return speed < 25
            ? 1
            : Math.max(1, Math.round((Math.min(100, Math.max(1, speed)) - 25) / 10));
    }

    function getProcessingDelay() {
        return Math.max(1, Math.round(100 / Math.sqrt(Math.min(100, Math.max(1, speed)))));
    }

    function getRollDuration() {
        return Math.round(1000 / Math.sqrt(Math.min(100, Math.max(1, speed))));
    }

    function complete() {
        if (isComplete) {
            return;
        }
        isComplete = true;
        isWaiting = false;
        onComplete?.();
    }

    function stopStreaming() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        animationFrame = undefined;
        abortController?.abort();
        abortController = undefined;
    }

    function reset() {
        stopStreaming();
        currentIndex = 0;
        displayedText = '';
        isComplete = false;
        isWaiting = false;
    }

    function applySnapshot(text: string) {
        displayedText = text;
        previousSnapshot = text;
        isWaiting = text.length === 0;
    }

    function renderString(text: string, id: number) {
        let lastFrameTime = 0;

        const nextFrame = (timestamp: number) => {
            if (id !== streamId) {
                return;
            }
            if (timestamp - lastFrameTime < getProcessingDelay()) {
                animationFrame = requestAnimationFrame(nextFrame);
                return;
            }
            lastFrameTime = timestamp;

            const endIndex = Math.min(currentIndex + getChunkSize(), text.length);
            displayedText = text.slice(0, endIndex);
            currentIndex = endIndex;

            if (endIndex < text.length) {
                animationFrame = requestAnimationFrame(nextFrame);
            } else {
                complete();
            }
        };

        animationFrame = requestAnimationFrame(nextFrame);
    }

    async function renderAsync(stream: AsyncIterable<string>, id: number) {
        const controller = new AbortController();
        abortController = controller;

        try {
            for await (const chunk of stream) {
                if (controller.signal.aborted || id !== streamId) {
                    return;
                }
                displayedText += chunk;
                if (displayedText.length > 0) {
                    isWaiting = false;
                }
            }
            complete();
        } catch (error) {
            if (!controller.signal.aborted) {
                onError?.(error);
                complete();
            }
        }
    }

    function startAsync(stream: AsyncIterable<string>) {
        reset();
        const id = ++streamId;
        isWaiting = true;
        sourceKind = 'async';
        renderAsync(stream, id);
    }

    $effect(() => {
        if (typeof textStream !== 'string') {
            if (sourceKind !== 'async' || previousSource !== textStream) {
                previousSource = textStream;
                startAsync(textStream);
            }
            return;
        }

        if (streaming) {
            const fresh = sourceKind !== 'snapshot';
            if (fresh) {
                reset();
                sourceKind = 'snapshot';
                applySnapshot(textStream);
                return;
            }
            if (textStream === previousSnapshot) {
                return;
            }
            if (!textStream.startsWith(previousSnapshot)) {
                applySnapshot(textStream);
                return;
            }
            applySnapshot(textStream);
            return;
        }

        if (sourceKind === 'snapshot') {
            stopStreaming();
            if (textStream !== previousSnapshot) {
                applySnapshot(textStream);
            }
            sourceKind = 'finalized-snapshot';
            complete();
            return;
        }

        if (sourceKind === 'finalized-snapshot' && textStream === previousSnapshot) {
            return;
        }

        reset();
        const id = ++streamId;
        sourceKind = 'static';
        previousSource = textStream;
        renderString(textStream, id);
    });

    const streamState = $derived.by(() => {
        if (isWaiting) {
            return 'waiting';
        }
        if (isComplete) {
            return 'complete';
        }
        return 'streaming';
    });

    onDestroy(stopStreaming);
</script>

<svelte:element
    this={as}
    bind:this={box}
    data-ui="response-stream"
    data-state={streamState}
    aria-live="polite"
    aria-busy={streaming || !isComplete}
    class={cn(
        className,
        'block font-medium whitespace-pre-wrap text-[length:var(--font-size-body)] leading-body text-foreground'
    )}
    {...rest}
>
    {#if Scritto}
        <Scritto value={displayedText} transition={rollTransition} />
    {:else}
        {displayedText}
    {/if}
    {#if isWaiting}
        <span
            aria-hidden="true"
            data-ui="response-stream-caret"
            class="sivir-response-stream-caret ms-0.5 inline-block h-4 w-px -translate-y-px bg-foreground-muted align-middle"
        ></span>
    {/if}
</svelte:element>

<style>
    .sivir-response-stream-caret {
        animation: sivir-response-stream-caret 1.1s steps(1, end) infinite;
    }

    @keyframes sivir-response-stream-caret {
        50% {
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-response-stream-caret {
            animation: none;
        }
    }
</style>
