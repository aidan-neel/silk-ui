<script lang="ts">
    import * as Select from '@sivir-ui/svelte/components/select';

    const timezones = [
        { value: 'pacific-honolulu', label: 'Hawaii (HST)' },
        { value: 'america-anchorage', label: 'Alaska (AKST)' },
        { value: 'america-los-angeles', label: 'Pacific Time (PT)' },
        { value: 'america-denver', label: 'Mountain Time (MT)' },
        { value: 'america-chicago', label: 'Central Time (CT)' },
        { value: 'america-new-york', label: 'Eastern Time (ET)' },
        { value: 'america-halifax', label: 'Atlantic Time (AT)' },
        { value: 'america-sao-paulo', label: 'São Paulo (BRT)' },
        { value: 'atlantic-azores', label: 'Azores (AZOT)' },
        { value: 'europe-london', label: 'London (GMT)' },
        { value: 'europe-paris', label: 'Paris (CET)' },
        { value: 'europe-berlin', label: 'Berlin (CET)' },
        { value: 'europe-athens', label: 'Athens (EET)' },
        { value: 'europe-istanbul', label: 'Istanbul (TRT)' },
        { value: 'africa-cairo', label: 'Cairo (EET)' },
        { value: 'africa-johannesburg', label: 'Johannesburg (SAST)' },
        { value: 'europe-moscow', label: 'Moscow (MSK)' },
        { value: 'asia-dubai', label: 'Dubai (GST)' },
        { value: 'asia-karachi', label: 'Karachi (PKT)' },
        { value: 'asia-kolkata', label: 'Kolkata (IST)' },
        { value: 'asia-bangkok', label: 'Bangkok (ICT)' },
        { value: 'asia-shanghai', label: 'Shanghai (CST)' },
        { value: 'asia-tokyo', label: 'Tokyo (JST)' },
        { value: 'asia-seoul', label: 'Seoul (KST)' },
        { value: 'australia-sydney', label: 'Sydney (AEST)' },
        { value: 'pacific-auckland', label: 'Auckland (NZST)' }
    ];

    let selectedTimezone = $state('america-new-york');
    const selected = $derived(timezones.find((zone) => zone.value === selectedTimezone));
</script>

<div class="flex flex-col gap-2">
    <span class="text-sm [font-weight:var(--font-weight-label,500)] text-foreground">Timezone</span>
    <Select.Root value={selectedTimezone}>
        <Select.Trigger class="min-w-[240px]" variant="outline">
            {selected?.label ?? 'Select timezone'}
        </Select.Trigger>
        <Select.Content class="max-h-56">
            {#each timezones as timezone (timezone.value)}
                <Select.Item
                    value={timezone.value}
                    onclick={() => (selectedTimezone = timezone.value)}
                >
                    {timezone.label}
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</div>
