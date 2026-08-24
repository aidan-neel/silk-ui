<script lang="ts">
    import Circle from '@lucide/svelte/icons/circle';
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import Minus from '@lucide/svelte/icons/minus';
    import SignalHigh from '@lucide/svelte/icons/signal-high';
    import SignalLow from '@lucide/svelte/icons/signal-low';
    import SignalMedium from '@lucide/svelte/icons/signal-medium';
    import SquarePen from '@lucide/svelte/icons/square-pen';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import { Label } from '@sivir-ui/svelte/components/label';
    import * as Select from '@sivir-ui/svelte/components/select';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import { Textarea } from '@sivir-ui/svelte/components/textarea';

    let issueTitle = $state('');
    let issueDescription = $state('');
    let status = $state('');
    let priority = $state('');
    let assignee = $state('');

    const statuses = [
        { value: 'todo', label: 'Todo', icon: Circle },
        { value: 'in-progress', label: 'In progress', icon: Circle },
        { value: 'done', label: 'Done', icon: Circle }
    ];

    const priorities = [
        { value: 'none', label: 'No priority', icon: Minus },
        { value: 'urgent', label: 'Urgent', icon: CircleAlert },
        { value: 'high', label: 'High', icon: SignalHigh },
        { value: 'medium', label: 'Medium', icon: SignalMedium },
        { value: 'low', label: 'Low', icon: SignalLow }
    ];

    const assignees = [
        { value: 'an', label: 'Aidan N.', initials: 'AN' },
        { value: 'sk', label: 'Sam K.', initials: 'SK' },
        { value: 'unassigned', label: 'Unassigned', initials: '?' }
    ];

    const statusMeta = $derived(statuses.find((s) => s.value === status));
    const priorityMeta = $derived(priorities.find((p) => p.value === priority));
    const assigneeMeta = $derived(assignees.find((a) => a.value === assignee));
</script>

<div class="flex items-center justify-center">
    <Sheet.Root>
        <Sheet.Trigger>
            <SquarePen size={16} />
            New issue
        </Sheet.Trigger>
        <Sheet.Content side="right">
            <Sheet.Header>
                <Sheet.Title>New issue</Sheet.Title>
                <Sheet.Description>Create a new issue in Engineering.</Sheet.Description>
            </Sheet.Header>

            <div class="flex flex-col gap-4 py-4">
                <Input bind:value={issueTitle} label="Title" placeholder="Issue title" />

                <Textarea
                    bind:value={issueDescription}
                    label="Description"
                    placeholder="Add description…"
                    class="min-h-[120px]"
                />

                <div class="h-px w-full bg-border" role="separator"></div>

                <div class="flex flex-col gap-3">
                    <div class="flex flex-col gap-1.5">
                        <Label>Status</Label>
                        <Select.Root bind:value={status}>
                            <Select.Trigger class="w-full" variant="outline">
                                <span class="flex min-w-0 items-center gap-2">
                                    {#if statusMeta}
                                        <statusMeta.icon
                                            size={14}
                                            class="shrink-0 text-foreground-muted"
                                        />
                                    {/if}
                                    <Select.Value placeholder="Status" />
                                </span>
                            </Select.Trigger>
                            <Select.Content>
                                {#each statuses as item (item.value)}
                                    <Select.Item value={item.value} label={item.label}>
                                        <span class="flex items-center gap-2">
                                            <item.icon size={14} class="text-foreground-muted" />
                                            {item.label}
                                        </span>
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <Label>Priority</Label>
                        <Select.Root bind:value={priority}>
                            <Select.Trigger class="w-full" variant="outline">
                                <span class="flex min-w-0 items-center gap-2">
                                    {#if priorityMeta}
                                        <priorityMeta.icon
                                            size={14}
                                            class="shrink-0 text-foreground-muted"
                                        />
                                    {/if}
                                    <Select.Value placeholder="Priority" />
                                </span>
                            </Select.Trigger>
                            <Select.Content>
                                {#each priorities as item (item.value)}
                                    <Select.Item value={item.value} label={item.label}>
                                        <span class="flex items-center gap-2">
                                            <item.icon size={14} class="text-foreground-muted" />
                                            {item.label}
                                        </span>
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <Label>Assignee</Label>
                        <Select.Root bind:value={assignee}>
                            <Select.Trigger class="w-full" variant="outline">
                                <span class="flex min-w-0 items-center gap-2">
                                    {#if assigneeMeta}
                                        <Avatar.Root size="sm" class="size-5 shrink-0 text-[10px]">
                                            <Avatar.Fallback
                                                >{assigneeMeta.initials}</Avatar.Fallback
                                            >
                                        </Avatar.Root>
                                    {/if}
                                    <Select.Value placeholder="Assignee" />
                                </span>
                            </Select.Trigger>
                            <Select.Content>
                                {#each assignees as person (person.value)}
                                    <Select.Item value={person.value} label={person.label}>
                                        <span class="flex items-center gap-2">
                                            <Avatar.Root size="sm" class="size-5 text-[10px]">
                                                <Avatar.Fallback>{person.initials}</Avatar.Fallback>
                                            </Avatar.Root>
                                            {person.label}
                                        </span>
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>
                </div>
            </div>

            <Sheet.Footer>
                <Sheet.Close variant="ghost">Cancel</Sheet.Close>
                <Button>Create issue</Button>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>
</div>
