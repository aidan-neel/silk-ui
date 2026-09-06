<script lang="ts">
    import * as Select from '@sivir-ui/svelte/components/select';

    const roles = [
        { value: 'viewer', label: 'Viewer' },
        { value: 'editor', label: 'Editor' },
        { value: 'billing', label: 'Billing administrator' }
    ];

    let role = $state('viewer');
    const selected = $derived(roles.find((r) => r.value === role));
</script>

<div class="flex flex-col gap-2">
    <span class="text-sm [font-weight:var(--font-weight-label,500)] text-foreground">Role</span>
    <Select.Root bind:value={role}>
        <Select.Trigger class="w-40" variant="outline">
            {selected?.label ?? 'Select role'}
        </Select.Trigger>
        <Select.Content dynamic>
            {#each roles as option (option.value)}
                <Select.Item value={option.value}>{option.label}</Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</div>
