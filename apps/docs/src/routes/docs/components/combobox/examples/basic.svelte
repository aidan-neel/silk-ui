<script lang="ts">
import * as Combobox from '@sivir-ui/svelte/components/combobox';

const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'pt', label: 'Portuguese' }
];
</script>

<div class="flex justify-center">
    <div class="w-[240px]">
        <Combobox.Root>
            <Combobox.Trigger placeholder="Select a language" class="w-full" />
            <Combobox.Content>
                <Combobox.Results>
                    {#each languages as item (item.value)}
                        <Combobox.Item value={item.value} label={item.label} callback={() => {}} />
                    {/each}
                </Combobox.Results>
            </Combobox.Content>
        </Combobox.Root>
    </div>
</div>
