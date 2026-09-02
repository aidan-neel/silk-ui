<script lang="ts">
    import Input from '@sivir-ui/svelte/components/input/input.svelte';

    let {
        type = 'text',
        class: classProp
    }: {
        type?: string;
        class?: string;
    } = $props();
</script>

<Input aria-label="Amount" value="120" {type} class={classProp}>
    {#snippet leading()}
        <span data-testid="leading">$</span>
    {/snippet}
    {#snippet trailing()}
        <span data-testid="trailing">USD</span>
    {/snippet}
</Input>
