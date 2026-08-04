<script lang="ts">
import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';

let { value = $bindable(''), name = 'rg', disabled = false } = $props();
</script>

<RadioGroup.Root bind:value {name} {disabled}>
    <RadioGroup.Item value="apple" label="Apple" />
    <RadioGroup.Item value="banana" label="Banana" />
    <RadioGroup.Item value="cherry" label="Cherry" />
</RadioGroup.Root>
