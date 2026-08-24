<script lang="ts">
    import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import { Label } from '@sivir-ui/svelte/components/label';
    import * as Select from '@sivir-ui/svelte/components/select';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import { Switch } from '@sivir-ui/svelte/components/switch';

    let status = $state('all');
    let onlyMine = $state(false);
    let includeArchived = $state(false);
    let hasAssignee = $state(true);
    let hasLabels = $state(true);

    const statuses = [
        { value: 'all', label: 'All statuses' },
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' }
    ];

    const statusLabel = $derived(statuses.find((s) => s.value === status)?.label ?? 'Status');
</script>

<Sheet.Root>
    <Sheet.Trigger variant="outline">
        <SlidersHorizontal size={14} />
        Filters
    </Sheet.Trigger>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>Filters</Sheet.Title>
            <Sheet.Description>Narrow the issue list.</Sheet.Description>
        </Sheet.Header>

        <div class="flex flex-col gap-4 py-4">
            <div class="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select.Root bind:value={status}>
                    <Select.Trigger class="w-full" variant="outline">{statusLabel}</Select.Trigger>
                    <Select.Content>
                        {#each statuses as item (item.value)}
                            <Select.Item value={item.value}>{item.label}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>

            <div class="h-px w-full bg-border" role="separator"></div>

            <div class="flex flex-col gap-3">
                <Switch bind:switched={onlyMine} label="Only my issues" />
                <Switch bind:switched={includeArchived} label="Include archived" />
            </div>

            <div class="h-px w-full bg-border" role="separator"></div>

            <div class="flex flex-col gap-3">
                <span class="text-sm [font-weight:var(--font-weight-label,500)] text-foreground"
                    >Fields</span
                >
                <Checkbox bind:checked={hasAssignee} label="Has assignee" />
                <Checkbox bind:checked={hasLabels} label="Has labels" />
            </div>
        </div>

        <Sheet.Footer>
            <Sheet.Close variant="ghost">Reset</Sheet.Close>
            <Button>Apply filters</Button>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
