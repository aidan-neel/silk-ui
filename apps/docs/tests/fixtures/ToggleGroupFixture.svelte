<script lang="ts">
import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';

let {
    type = 'single',
    value = $bindable<string | string[] | undefined>(''),
    disabled = false
}: {
    type?: 'single' | 'multiple';
    value?: string | string[] | undefined;
    disabled?: boolean;
} = $props();
</script>

<ToggleGroup.Root {type} bind:value {disabled}>
    <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
    <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
    <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
</ToggleGroup.Root>
