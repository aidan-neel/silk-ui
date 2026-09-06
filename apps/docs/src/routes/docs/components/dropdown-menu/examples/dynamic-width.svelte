<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';

    const densities = ['Compact', 'Comfortable', 'Spacious'];
    let density = $state(densities[1]);
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger size="md">Open menu</DropdownMenu.Trigger>
    <DropdownMenu.Content dynamic>
        <DropdownMenu.Label>Appearance</DropdownMenu.Label>
        <DropdownMenu.Item>Edit dashboard settings</DropdownMenu.Item>
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Density</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent dynamic>
                {#each densities as option (option)}
                    <DropdownMenu.Item callback={() => (density = option)}>
                        <span class="flex-1">{option}</span>
                        {#if density === option}
                            <Check size={13} aria-hidden="true" />
                        {/if}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Item>Reset everything to defaults</DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
