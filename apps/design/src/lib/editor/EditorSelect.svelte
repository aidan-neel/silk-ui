<script lang="ts">
    import { Select } from '@sivir-ui/svelte';

    type Props = {
        label: string;
        value: string;
        options: readonly string[];
        onchange: (value: string) => void;
        class?: string;
    };

    let { label, value, options, onchange, class: className }: Props = $props();
    let current = $state('');
    let emitted = '';

    $effect(() => {
        if (value !== emitted) {
            emitted = value;
            current = value;
        }
    });

    $effect(() => {
        if (current !== emitted) {
            emitted = current;
            onchange(current);
        }
    });
</script>

<Select.Root bind:value={current}>
    <Select.Trigger class={`w-full ${className ?? ''}`} variant="outline" aria-label={label}>
        <span class="truncate">{current || label}</span>
    </Select.Trigger>
    <Select.Content>
        {#each options as option}
            <Select.Item value={option} label={option}>{option}</Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
