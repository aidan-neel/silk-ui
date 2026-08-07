<script lang="ts">
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';

    let finalizePricing = $state(true);
    let writeChangelog = $state(true);
    let qaNavigation = $state(false);
    let scheduleAnnouncement = $state(false);
    let updateDocs = $state(false);

    const completedCount = $derived(
        [finalizePricing, writeChangelog, qaNavigation, scheduleAnnouncement, updateDocs].filter(
            Boolean
        ).length
    );
    const totalCount = 5;
</script>

<div class="w-full max-w-80">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between gap-4">
        <h3 class="text-foreground [font-weight:var(--font-weight-label,500)]">Launch checklist</h3>
        <span class="text-sm text-foreground-muted [font-weight:var(--font-weight-label,500)]">
            {completedCount}
            / {totalCount}
        </span>
    </div>

    <!-- Checklist items -->
    <div class="space-y-3">
        <Checkbox bind:checked={finalizePricing} label="Finalize pricing page" />
        <Checkbox bind:checked={writeChangelog} label="Write the changelog" />
        <Checkbox bind:checked={qaNavigation} label="QA mobile navigation" />
        <Checkbox bind:checked={scheduleAnnouncement} label="Schedule the announcement tweet" />
        <Checkbox bind:checked={updateDocs} label="Update docs screenshots" />
    </div>
</div>
