<script lang="ts">
    import * as ApprovalRequest from '@sivir-ui/svelte/components/approval-request';
    import { Button } from '@sivir-ui/svelte/components/button';

    let open = $state(false);
</script>

{#snippet commandDetails()}
    <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt>Command</dt>
        <dd class="truncate text-foreground">bun run db:migrate --production</dd>
        <dt>Target</dt>
        <dd class="truncate text-foreground">primary-us-east-1</dd>
        <dt>Migration</dt>
        <dd class="truncate text-foreground">20260730_add_retention_policy.sql</dd>
    </dl>
{/snippet}

<div class="flex w-full max-w-xl flex-col items-center gap-3">
    <Button onclick={() => (open = true)}>Show approval request</Button>
</div>

<ApprovalRequest.Root bind:open risk="high">
    <ApprovalRequest.Content>
        <ApprovalRequest.Header>
            <ApprovalRequest.Status>
                <ApprovalRequest.Icon />
                <ApprovalRequest.Risk />
            </ApprovalRequest.Status>
            <ApprovalRequest.Title>Approve a database migration?</ApprovalRequest.Title>
            <ApprovalRequest.Description>
                This example asks for approval before running a database migration.
            </ApprovalRequest.Description>
        </ApprovalRequest.Header>
        <ApprovalRequest.Details>{@render commandDetails()}</ApprovalRequest.Details>
        <ApprovalRequest.Footer>
            <ApprovalRequest.Cancel>Reject migration</ApprovalRequest.Cancel>
            <ApprovalRequest.Confirm>Approve migration</ApprovalRequest.Confirm>
        </ApprovalRequest.Footer>
    </ApprovalRequest.Content>
</ApprovalRequest.Root>
