<script lang="ts">
    import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root variant="panel" class="w-full max-w-[22rem]">
    <Card.Header>
        <Card.Title>Inset surface</Card.Title>
        <Card.Description>Concentric double-line frame for denser UI chrome.</Card.Description>
    </Card.Header>
    <Card.Content>
        <p class="m-0 text-sm text-foreground-muted">
            Use <code class="font-mono text-foreground">variant="panel"</code> when a card should sit
            inside a framed surface instead of a flat border.
        </p>
    </Card.Content>
</Card.Root>
