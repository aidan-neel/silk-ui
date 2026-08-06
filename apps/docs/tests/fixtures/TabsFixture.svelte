<script lang="ts">
    import type { TabsVariant } from '@sivir-ui/svelte/components/tabs';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';

    let {
        value = $bindable('one'),
        orientation = 'horizontal' as 'horizontal' | 'vertical',
        variant = 'default' as TabsVariant
    } = $props();
</script>

<Tabs.Root bind:value {orientation} {variant}>
    <Tabs.List>
        <Tabs.Trigger value="one"><span data-testid="trig-one">One</span></Tabs.Trigger>
        <Tabs.Trigger value="two"><span data-testid="trig-two">Two</span></Tabs.Trigger>
        <Tabs.Trigger value="three" disabled>
            <span data-testid="trig-three">Three</span>
        </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="one"><span data-testid="content-one">One content</span></Tabs.Content>
    <Tabs.Content value="two"><span data-testid="content-two">Two content</span></Tabs.Content>
    <Tabs.Content value="three"
        ><span data-testid="content-three">Three content</span></Tabs.Content
    >
</Tabs.Root>
