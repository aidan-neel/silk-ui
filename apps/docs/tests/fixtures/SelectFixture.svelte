<script lang="ts">
import * as Select from '@sivir-ui/svelte/components/select';
</script>

<Select.Root>
    <Select.Trigger>
        <span data-testid="select-trigger">
            <Select.Value placeholder="Select an option" />
        </span>
    </Select.Trigger>
    <Select.Content>
        <Select.Label>Fruits</Select.Label>
        <Select.Item value="apple" label="Apple"
            ><span data-testid="opt-apple">Apple</span></Select.Item
        >
        <Select.Item value="banana" label="Banana"
            ><span data-testid="opt-banana">Banana</span></Select.Item
        >
        <Select.Item value="cherry" label="Cherry"
            ><span data-testid="opt-cherry">Cherry</span></Select.Item
        >
    </Select.Content>
</Select.Root>
