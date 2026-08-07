<script lang="ts">
    import * as Accordion from '@sivir-ui/svelte/components/accordion';

    let {
        type = 'single' as 'single' | 'multiple',
        value = $bindable<string | string[] | undefined>(undefined),
        collapsible = false
    } = $props();
</script>

<Accordion.Root {type} bind:value {collapsible}>
    <Accordion.Item value="a">
        <Accordion.Trigger><span data-testid="trig-a">Item A</span></Accordion.Trigger>
        <Accordion.Content><span data-testid="content-a">Content A</span></Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="b">
        <Accordion.Trigger><span data-testid="trig-b">Item B</span></Accordion.Trigger>
        <Accordion.Content><span data-testid="content-b">Content B</span></Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="c" disabled>
        <Accordion.Trigger><span data-testid="trig-c">Item C</span></Accordion.Trigger>
        <Accordion.Content><span data-testid="content-c">Content C</span></Accordion.Content>
    </Accordion.Item>
</Accordion.Root>
