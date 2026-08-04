<script lang="ts">
import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';

let value = $state<string | undefined>('pro');
</script>

<RadioGroup.Root bind:value name="plan">
    <RadioGroup.Item value="free" label="Free" description="For solo hobby projects." />
    <RadioGroup.Item value="pro" label="Pro" description="For small teams and side projects." />
    <RadioGroup.Item
        value="team"
        label="Team"
        description="Audit log, SSO, and priority support."
    />
</RadioGroup.Root>
