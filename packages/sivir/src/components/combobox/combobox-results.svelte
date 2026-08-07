<script lang="ts">
    import { onMount, type Snippet, tick } from 'svelte';
    import { getComboboxContext } from './context.svelte';

    const { id, state: comboboxState } = getComboboxContext();

    type Props = {
        children?: Snippet;
    };

    const { children }: Props = $props();
    let resultsElement = $state<HTMLElement>();
    let highlightStyle = $state('opacity: 0');
    let highlightReady = $state(false);
    let filtering = $state(false);
    let frame = 0;
    let restoreFrame = 0;
    let filteringRevision = 0;
    let previousSearchContent = '';

    function followActiveTransitions() {
        if (filtering) {
            frame = requestAnimationFrame(measureHighlight);
        }
    }

    function measureHighlight() {
        frame = 0;
        const activeElement = resultsElement?.querySelector<HTMLElement>(
            '[data-collection-item][data-collection-active="true"]'
        );
        if (!resultsElement || !activeElement || activeElement.hidden) {
            highlightStyle = 'opacity: 0';
            followActiveTransitions();
            return;
        }

        const resultsBounds = resultsElement.getBoundingClientRect();
        const itemBounds = activeElement.getBoundingClientRect();
        const x = itemBounds.left - resultsBounds.left - resultsElement.clientLeft;
        const y =
            itemBounds.top -
            resultsBounds.top -
            resultsElement.clientTop +
            resultsElement.scrollTop;

        highlightStyle = [
            `width: ${itemBounds.width}px`,
            `height: ${itemBounds.height}px`,
            `transform: translate3d(${x}px, ${y}px, 0)`,
            'opacity: 1'
        ].join('; ');
        followActiveTransitions();
    }

    function scheduleMeasure() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measureHighlight);
    }

    async function trackFiltering() {
        const revision = ++filteringRevision;
        filtering = true;
        cancelAnimationFrame(restoreFrame);
        await tick();
        scheduleMeasure();

        const animations = Array.from(
            resultsElement?.querySelectorAll<HTMLElement>('[data-collection-item]') ?? []
        )
            .flatMap((item) => item.getAnimations())
            .filter(isFilteringTransition);
        await Promise.allSettled(animations.map((animation) => animation.finished));
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        if (revision !== filteringRevision) {
            return;
        }

        measureHighlight();
        restoreFrame = requestAnimationFrame(() => {
            restoreFrame = 0;
            filtering = false;
        });
    }

    function isFilteringTransition(animation: Animation) {
        if (!(animation instanceof CSSTransition)) {
            return false;
        }

        return [
            'height',
            'opacity',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width'
        ].includes(animation.transitionProperty);
    }

    function activateHoveredItem(event: PointerEvent) {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const element = target.closest<HTMLElement>('[data-collection-item]');
        if (
            !element ||
            !resultsElement?.contains(element) ||
            element.matches(':disabled, [aria-disabled="true"]')
        ) {
            return;
        }

        const value = element.dataset.comboboxValue;
        if (value) {
            comboboxState.activeValue = value;
        }
    }

    $effect(() => {
        const searchContent = comboboxState.searchContent;
        void comboboxState.activeValue;
        if (searchContent !== previousSearchContent) {
            previousSearchContent = searchContent;
            void trackFiltering();
        }
        void tick().then(scheduleMeasure);
    });

    onMount(() => {
        const element = resultsElement;
        if (!element) {
            return;
        }

        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(element);
        window.addEventListener('resize', scheduleMeasure);

        const readyFrame = requestAnimationFrame(() => {
            highlightReady = true;
        });

        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(readyFrame);
            cancelAnimationFrame(restoreFrame);
            filteringRevision += 1;
            filtering = false;
            observer.disconnect();
            window.removeEventListener('resize', scheduleMeasure);
        };
    });
</script>

<div
    bind:this={resultsElement}
    role="listbox"
    id={`combobox-${id}-listbox`}
    tabindex={-1}
    data-ui="combobox-results"
    onpointerover={activateHoveredItem}
    onscroll={scheduleMeasure}
    class={comboboxState.searchPlacement === 'menu'
        ? 'sivir-collection-surface flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto p-1'
        : 'sivir-collection-surface flex max-h-full flex-col gap-0 overflow-y-auto p-1'}
>
    <span
        class={['sivir-item-highlight', filtering && 'transition-none']}
        data-ready={highlightReady}
        aria-hidden="true"
        style={highlightStyle}
    ></span>

    {@render children?.()}

    {#if comboboxState.searchContent !== '' && comboboxState.results.size === 0}
        <div class="flex w-full items-center justify-center p-3">
            <p
                class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
            >
                No results found
            </p>
        </div>
    {/if}
</div>
