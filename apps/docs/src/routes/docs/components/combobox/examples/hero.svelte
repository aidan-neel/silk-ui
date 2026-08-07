<script lang="ts">
    import * as Combobox from '@sivir-ui/svelte/components/combobox';

    const frameworks = [
        { value: 'nextjs', label: 'Next.js' },
        { value: 'sveltekit', label: 'SvelteKit' },
        { value: 'nuxtjs', label: 'Nuxt.js' },
        { value: 'remix', label: 'Remix' },
        { value: 'astro', label: 'Astro' }
    ];
</script>

<div class="flex items-center justify-center">
    <div class="w-[280px]">
        <Combobox.Root>
            <Combobox.Trigger placeholder="Select a framework" class="w-full" />
            <Combobox.Content>
                <Combobox.Results>
                    {#each frameworks as item (item.value)}
                        <Combobox.Item value={item.value} label={item.label} callback={() => {}} />
                    {/each}
                </Combobox.Results>
            </Combobox.Content>
        </Combobox.Root>
    </div>
</div>
