<script lang="ts">
    import * as Combobox from '@sivir-ui/svelte/components/combobox';

    const countries = [
        { value: 'ar', label: 'Argentina' },
        { value: 'au', label: 'Australia' },
        { value: 'at', label: 'Austria' },
        { value: 'be', label: 'Belgium' },
        { value: 'br', label: 'Brazil' },
        { value: 'ca', label: 'Canada' },
        { value: 'cl', label: 'Chile' },
        { value: 'cn', label: 'China' },
        { value: 'co', label: 'Colombia' },
        { value: 'cz', label: 'Czechia' },
        { value: 'dk', label: 'Denmark' },
        { value: 'eg', label: 'Egypt' },
        { value: 'fi', label: 'Finland' },
        { value: 'fr', label: 'France' },
        { value: 'de', label: 'Germany' },
        { value: 'gr', label: 'Greece' },
        { value: 'in', label: 'India' },
        { value: 'id', label: 'Indonesia' },
        { value: 'ie', label: 'Ireland' },
        { value: 'il', label: 'Israel' },
        { value: 'it', label: 'Italy' },
        { value: 'jp', label: 'Japan' },
        { value: 'ke', label: 'Kenya' },
        { value: 'kr', label: 'South Korea' },
        { value: 'mx', label: 'Mexico' },
        { value: 'nl', label: 'Netherlands' },
        { value: 'nz', label: 'New Zealand' },
        { value: 'ng', label: 'Nigeria' },
        { value: 'no', label: 'Norway' },
        { value: 'pl', label: 'Poland' },
        { value: 'pt', label: 'Portugal' },
        { value: 'sa', label: 'Saudi Arabia' },
        { value: 'sg', label: 'Singapore' },
        { value: 'za', label: 'South Africa' },
        { value: 'es', label: 'Spain' },
        { value: 'se', label: 'Sweden' },
        { value: 'ch', label: 'Switzerland' },
        { value: 'th', label: 'Thailand' },
        { value: 'tr', label: 'Turkey' },
        { value: 'ae', label: 'United Arab Emirates' },
        { value: 'gb', label: 'United Kingdom' },
        { value: 'us', label: 'United States' }
    ];
</script>

<div class="flex justify-center">
    <div class="w-[260px]">
        <Combobox.Root>
            <Combobox.Trigger placeholder="Select a country" class="w-full" />
            <Combobox.Content class="max-h-56">
                <Combobox.Results>
                    {#each countries as country (country.value)}
                        <Combobox.Item
                            value={country.value}
                            label={country.label}
                            callback={() => {}}
                        />
                    {/each}
                </Combobox.Results>
            </Combobox.Content>
        </Combobox.Root>
    </div>
</div>
