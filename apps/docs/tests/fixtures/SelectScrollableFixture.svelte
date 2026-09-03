<script lang="ts">
    import * as Select from '@sivir-ui/svelte/components/select';

    const options = Array.from({ length: 30 }, (_, index) => ({
        value: `option-${index}`,
        label: `Option ${index}`
    }));
</script>

<Select.Root>
    <Select.Trigger>
        <span data-testid="select-scrollable-trigger">
            <Select.Value placeholder="Select an option" />
        </span>
    </Select.Trigger>
    <Select.Content class="max-h-56">
        {#each options as option (option.value)}
            <Select.Item value={option.value} label={option.label}>
                <span data-testid={`scrollable-${option.value}`}>{option.label}</span>
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
