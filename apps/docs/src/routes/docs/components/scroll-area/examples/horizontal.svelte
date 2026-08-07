<script lang="ts">
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';

    const tabs = [
        'Overview',
        'Activity',
        'Settings',
        'Members',
        'Billing',
        'Integrations',
        'Webhooks',
        'Security',
        'Audit log',
        'Danger zone'
    ];
</script>

<div class="flex items-center justify-center p-10">
    <ScrollArea
        orientation="horizontal"
        class="w-72 rounded-[var(--radius-lg)] border border-border bg-card p-2"
    >
        <div class="flex gap-2">
            {#each tabs as tab (tab)}
                <span
                    class="whitespace-nowrap rounded-md bg-secondary px-3 py-1.5 text-sm text-foreground"
                >
                    {tab}
                </span>
            {/each}
        </div>
    </ScrollArea>
</div>
