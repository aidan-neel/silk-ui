<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';

    let activeTab = $state('overview');
</script>

<div class="flex justify-center p-3 sm:p-6">
    <div class="w-full max-w-sm">
        <Tabs.Root bind:value={activeTab}>
            <Tabs.List class="grid w-full grid-cols-3">
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                <Tabs.Trigger value="files">Files</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="overview" class="pt-4">
                <div class="rounded-lg border border-border bg-surface p-4">
                    <p class="text-sm font-medium text-foreground">Project overview</p>
                    <p class="mt-1 text-sm text-foreground-muted">Everything is up to date.</p>
                </div>
            </Tabs.Content>

            <Tabs.Content value="activity" class="pt-4">
                <div class="rounded-lg border border-border bg-surface p-4">
                    <p class="text-sm font-medium text-foreground">Recent activity</p>
                    <p class="mt-1 text-sm text-foreground-muted">
                        You updated the project settings.
                    </p>
                </div>
            </Tabs.Content>

            <Tabs.Content value="files" class="pt-4">
                <div class="rounded-lg border border-border bg-surface p-4">
                    <p class="text-sm font-medium text-foreground">Files</p>
                    <p class="mt-1 text-sm text-foreground-muted">README.md and package.json</p>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </div>
</div>
