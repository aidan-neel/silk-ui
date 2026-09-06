<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root class="w-full max-w-[28rem]">
    <Card.Header>
        <Card.Title>Account settings</Card.Title>
        <Card.Description>Manage your workspace settings.</Card.Description>
    </Card.Header>
    <Card.Content>
        <p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
            Currently on the Team plan. 12 of 25 seats used.
        </p>
    </Card.Content>
    <Card.Footer>
        <Button variant="outline" size="md">Cancel</Button>
        <Button size="md">Save changes</Button>
    </Card.Footer>
</Card.Root>
