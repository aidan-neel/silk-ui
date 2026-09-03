<script lang="ts">
    import * as Combobox from '@sivir-ui/svelte/components/combobox';

    const customers = [
        { value: 'northwind', label: 'Northwind Trading' },
        { value: 'halcyon', label: 'Halcyon Studio' },
        { value: 'kestrel', label: 'Kestrel Logistics' },
        { value: 'mercury', label: 'Mercury Goods' },
        { value: 'assembly', label: 'Assembly Works' }
    ];
</script>

<div class="flex justify-center">
    <div class="w-[280px]">
        <Combobox.Root>
            <Combobox.Trigger appearance="input" placeholder="Search customers" class="w-full" />
            <Combobox.Content>
                <Combobox.Results>
                    {#each customers as item (item.value)}
                        <Combobox.Item value={item.value} label={item.label} callback={() => {}} />
                    {/each}
                </Combobox.Results>
            </Combobox.Content>
        </Combobox.Root>
    </div>
</div>
