<script lang="ts">
    import * as Combobox from '@sivir-ui/svelte/components/combobox';

    const repositories = [
        { value: 'sivir-ui', label: 'sivir-ui/svelte' },
        { value: 'svelte', label: 'sveltejs/svelte' },
        { value: 'vite', label: 'vitejs/vite' },
        { value: 'tailwind', label: 'tailwindlabs/tailwindcss' },
        { value: 'lucide', label: 'lucide-icons/lucide' }
    ];
</script>

<div class="flex justify-center">
    <div class="w-[300px]">
        <Combobox.Root>
            <Combobox.Trigger
                searchPlacement="menu"
                placeholder="Choose a repository"
                class="w-full"
            />
            <Combobox.Content>
                <Combobox.Results>
                    {#each repositories as repository (repository.value)}
                        <Combobox.Item
                            value={repository.value}
                            label={repository.label}
                            callback={() => {}}
                        />
                    {/each}
                </Combobox.Results>
            </Combobox.Content>
        </Combobox.Root>
    </div>
</div>
