<script lang="ts">
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
</script>

<ToggleGroup.Root type="multiple" value={['left', 'center']}>
    <ToggleGroup.Item value="left">Option A</ToggleGroup.Item>
    <ToggleGroup.Item value="center">Option B</ToggleGroup.Item>
    <ToggleGroup.Item value="right">Option C</ToggleGroup.Item>
</ToggleGroup.Root>
