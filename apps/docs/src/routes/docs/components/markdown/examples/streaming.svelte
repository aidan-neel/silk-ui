<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Markdown } from '@sivir-ui/svelte/components/markdown';

    const chunks = [
        '### Incident update\n\nThe elevated error rate is isolated to image transformations in `fra1`.',
        '\n\n- Cache reads remain healthy\n- Origin requests are within baseline',
        '\n- Transformation workers are exhausting memory',
        '\n\n**Next step:** reduce worker concurrency from 12 to 8 and observe the next five minutes.'
    ];

    let step = $state(0);
    const content = $derived(chunks.slice(0, step + 1).join(''));
    const streaming = $derived(step < chunks.length - 1);

    function advance() {
        step = streaming ? step + 1 : 0;
    }
</script>

<div class="w-full max-w-2xl space-y-4">
    <div
        class="min-h-52 rounded-[var(--radius-xl)] border border-border bg-panel px-5 py-4 sm:px-6"
    >
        <Markdown {content} {streaming} />
    </div>
    <div class="flex items-center justify-between gap-4">
        <p class="text-sm text-foreground-muted" role="status">
            {streaming ? `Receiving chunk ${step + 1} of ${chunks.length}` : 'Response complete'}
        </p>
        <Button variant="ghost" size="sm" onclick={advance}>
            {#if streaming}
                Stream next chunk
                <ArrowRight size={14} aria-hidden="true" />
            {:else}
                <RotateCcw size={14} aria-hidden="true" />
                Restart stream
            {/if}
        </Button>
    </div>
</div>
