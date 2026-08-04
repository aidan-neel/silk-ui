<script lang="ts">
import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

let { open = $bindable(false), disabled = false } = $props();
</script>

<Collapsible.Root bind:open {disabled}>
    <Collapsible.Trigger>
        <span data-testid="collapsible-trigger">Toggle</span>
    </Collapsible.Trigger>
    <Collapsible.Content>
        <span data-testid="collapsible-content">Collapsible content</span>
    </Collapsible.Content>
</Collapsible.Root>
