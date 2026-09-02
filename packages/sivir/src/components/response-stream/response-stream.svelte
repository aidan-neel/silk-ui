<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy } from 'svelte';
    import type { ResponseStreamProps, Segment } from '.';

    let {
        textStream,
        streaming = false,
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
    let isWaiting = $state(false);
    let currentIndex = 0;
    let streamId = 0;
    let snapshotSession = 0;
    let sourceKind: 'static' | 'snapshot' | 'finalized-snapshot' | 'async' | undefined;
    let previousSource: string | AsyncIterable<string> | undefined;
    let previousSnapshot = '';
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
        if (typeof segmentDelay === 'number') {
            return Math.max(0, segmentDelay);
        }
        return 0;
    }

    function updateSegments(text: string, snapshot = false) {
        if (mode !== 'fade') {
            return;
        }
        try {
            const segmenter = new Intl.Segmenter(navigator.language, { granularity: 'word' });
            segments = Array.from(segmenter.segment(text), (segment, index) => ({
                text: segment.segment,
                index,
                key: snapshot ? `${snapshotSession}-${index}` : `${index}-${segment.segment}`
            }));
        } catch (error) {
            segments = text
                .split(/(\s+)/)
                .filter(Boolean)
                .map((text, index) => ({
                    text,
                    index,
                    key: snapshot ? `${snapshotSession}-${index}` : `${index}-${text}`
                }));
            onError?.(error);
        }
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
        segments = [];
        isComplete = false;
        isWaiting = false;
    }

    function applySnapshot(text: string, fresh = false) {
        if (fresh) {
            snapshotSession += 1;
        }
        displayedText = text;
        updateSegments(text, true);
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
                if (displayedText.length > 0) {
                    isWaiting = false;
                }
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

    function startAsync(stream: AsyncIterable<string>) {
        reset();
        const id = ++streamId;
        isLive = true;
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
                isLive = true;
                applySnapshot(textStream, true);
                return;
            }
            if (textStream === previousSnapshot) {
                return;
            }
            if (!textStream.startsWith(previousSnapshot)) {
                applySnapshot(textStream, true);
                return;
            }
            applySnapshot(textStream);
            return;
        }

        if (sourceKind === 'snapshot') {
            stopStreaming();
            if (textStream !== previousSnapshot) {
                applySnapshot(textStream, !textStream.startsWith(previousSnapshot));
            }
            isLive = false;
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
        isLive = false;
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
    data-ui="response-stream"
    data-mode={mode}
    data-state={streamState}
    aria-live="polite"
    aria-busy={streaming || !isComplete}
    class={cn(
        className,
        'whitespace-pre-wrap text-[length:var(--font-size-body)] leading-6 text-foreground'
    )}
    {...rest}
>
    {#if mode === 'fade'}
        {#each segments as segment (segment.key)}
            <span
                class="sivir-response-stream-segment"
                style:--response-stream-fade-duration={`${getFadeDuration()}ms`}
                style:--response-stream-segment-delay={`${isLive ? getSegmentDelay() : segment.index * getSegmentDelay()}ms`}
            >
                {segment.text}
            </span>
        {/each}
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
    .sivir-response-stream-segment {
        display: inline-block;
        filter: blur(3px);
        opacity: 0;
        animation: sivir-response-stream-fade-in var(--response-stream-fade-duration)
            var(--ease-out) forwards;
        animation-delay: var(--response-stream-segment-delay);
    }

    .sivir-response-stream-caret {
        animation: sivir-response-stream-caret 1.1s steps(1, end) infinite;
    }

    @keyframes sivir-response-stream-fade-in {
        to {
            filter: blur(0);
            opacity: 1;
        }
    }

    @keyframes sivir-response-stream-caret {
        50% {
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-response-stream-segment {
            animation: none;
            filter: none;
            opacity: 1;
        }

        .sivir-response-stream-caret {
            animation: none;
        }
    }
</style>
