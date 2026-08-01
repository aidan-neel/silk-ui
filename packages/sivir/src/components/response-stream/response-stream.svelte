<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ResponseStreamProps, Segment } from '.';

    let {
        textStream,
        mode = 'typewriter',
        speed = 20,
        fadeDuration,
        segmentDelay,
        characterChunkSize,
        onComplete,
        onError,
        as = 'span',
        class: className,
        ...rest
    }: ResponseStreamProps = $props();

    let displayedText = $state('');
    let segments = $state<Segment[]>([]);
    let isComplete = $state(false);
    let isLive = $state(false);
    let currentIndex = 0;
    let streamId = 0;
    let animationFrame: number | undefined;
    let abortController: AbortController | undefined;

    function getChunkSize() {
        if (typeof characterChunkSize === 'number') {
            return Math.max(1, characterChunkSize);
        }
        return speed < 25
            ? 1
            : Math.max(1, Math.round((Math.min(100, Math.max(1, speed)) - 25) / 10));
    }

    function getProcessingDelay() {
        if (typeof segmentDelay === 'number') {
            return Math.max(0, segmentDelay);
        }
        return Math.max(1, Math.round(100 / Math.sqrt(Math.min(100, Math.max(1, speed)))));
    }

    function getFadeDuration() {
        if (typeof fadeDuration === 'number') {
            return Math.max(10, fadeDuration);
        }
        return Math.round(1000 / Math.sqrt(Math.min(100, Math.max(1, speed))));
    }

    function getSegmentDelay() {
        return getProcessingDelay();
    }

    function updateSegments(text: string) {
        if (mode !== 'fade') {
            return;
        }
        try {
            const segmenter = new Intl.Segmenter(navigator.language, { granularity: 'word' });
            segments = Array.from(segmenter.segment(text), (segment, index) => ({
                text: segment.segment,
                index
            }));
        } catch (error) {
            segments = text
                .split(/(\s+)/)
                .filter(Boolean)
                .map((text, index) => ({ text, index }));
            onError?.(error);
        }
    }

    function complete() {
        if (isComplete) {
            return;
        }
        isComplete = true;
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
        segments = [];
        isComplete = false;
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
            updateSegments(displayedText);
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
                updateSegments(displayedText);
            }
            complete();
        } catch (error) {
            if (!controller.signal.aborted) {
                onError?.(error);
                complete();
            }
        }
    }

    function startStreaming() {
        reset();
        const id = ++streamId;
        isLive = typeof textStream !== 'string';
        if (typeof textStream === 'string') {
            renderString(textStream, id);
        } else {
            renderAsync(textStream, id);
        }
    }

    $effect(() => {
        textStream;
        startStreaming();
        return stopStreaming;
    });
</script>

<svelte:element
    this={as}
    data-ui="response-stream"
    data-mode={mode}
    aria-live="polite"
    aria-busy={!isComplete}
    class={cn(
        className,
        'whitespace-pre-wrap text-[length:var(--font-size-body)] leading-6 text-foreground'
    )}
    {...rest}
>
    {#if mode === 'fade'}
        {#each segments as segment (`${segment.index}-${segment.text}`)}
            <span
                class="sivir-response-stream-segment"
                style:--response-stream-fade-duration={`${isLive ? 0 : getFadeDuration()}ms`}
                style:--response-stream-segment-delay={`${isLive ? 0 : segment.index * getSegmentDelay()}ms`}
            >
                {segment.text}
            </span>
        {/each}
    {:else}
        {displayedText}
    {/if}
</svelte:element>

<style>
    .sivir-response-stream-segment {
        display: inline-block;
        opacity: 0;
        animation: sivir-response-stream-fade-in var(--response-stream-fade-duration)
            var(--ease-out) forwards;
        animation-delay: var(--response-stream-segment-delay);
    }

    @keyframes sivir-response-stream-fade-in {
        to {
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-response-stream-segment {
            animation: none;
            opacity: 1;
        }
    }
</style>
