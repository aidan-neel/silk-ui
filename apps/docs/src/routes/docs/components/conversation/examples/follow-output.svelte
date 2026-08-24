<script lang="ts">
    import Plus from '@lucide/svelte/icons/plus';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import * as Message from '@sivir-ui/svelte/components/message';

    let follow = $state(true);
    let output = $state([
        { id: 1, label: 'Queued release web-2419' },
        { id: 2, label: 'Built application bundle in 18.2s' },
        { id: 3, label: 'Uploaded 42 immutable assets' },
        { id: 4, label: 'Deployed canary to iad1' },
        { id: 5, label: 'Passed checkout smoke tests' },
        { id: 6, label: 'Shifted 10% of production traffic' },
        { id: 7, label: 'Observed p95 latency at 612 ms' }
    ]);

    const updates = [
        'Shifted 25% of production traffic',
        'Observed p95 latency at 584 ms',
        'Passed payment-provider health check',
        'Shifted 50% of production traffic'
    ];
    const followLabel = $derived(follow ? 'Following latest output' : 'Follow paused');

    function appendOutput() {
        const index = output.length - 7;
        output.push({
            id: output.length + 1,
            label: updates[index % updates.length]
        });
    }
</script>

<div class="w-full max-w-2xl space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="flex items-center gap-2 text-sm text-foreground-muted" role="status">
            <span class="size-1.5 rounded-full bg-primary" aria-hidden="true"></span>
            {followLabel}
        </p>
        <Button variant="ghost" size="sm" onclick={appendOutput}>
            <Plus size={14} aria-hidden="true" />
            Append output
        </Button>
    </div>

    <Conversation.Root
        bind:follow
        class="h-[22rem] rounded-[var(--radius-xl)] border border-border bg-panel"
    >
        <Conversation.Content aria-label="Live deployment output">
            {#each output as entry (entry.id)}
                <Message.Root from="assistant">
                    <Message.Content>{entry.label}</Message.Content>
                </Message.Root>
            {/each}
        </Conversation.Content>
        <Conversation.ScrollButton />
    </Conversation.Root>

    <p class="text-xs leading-5 text-foreground-muted">
        Scroll up to pause following. Append more output, then use the arrow to return to the latest
        step.
    </p>
</div>
