<script lang="ts">
import * as Tabs from '@sivir-ui/svelte/components/tabs';

let tab = $state('vanilla');
</script>

<Tabs.Root bind:value={tab} variant="segmented">
    <Tabs.List>
        <Tabs.Trigger value="vanilla">Vanilla</Tabs.Trigger>
        <Tabs.Trigger value="react">React</Tabs.Trigger>
        <Tabs.Trigger value="vue">Vue</Tabs.Trigger>
        <Tabs.Trigger value="solid">Solid</Tabs.Trigger>
        <Tabs.Trigger value="svelte">Svelte</Tabs.Trigger>
    </Tabs.List>
</Tabs.Root>
