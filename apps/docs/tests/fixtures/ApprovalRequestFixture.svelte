<script lang="ts">
    import type { ApprovalRisk } from '@sivir-ui/svelte/components/approval-request';
    import * as ApprovalRequest from '@sivir-ui/svelte/components/approval-request';
    import { Button } from '@sivir-ui/svelte/components/button';

    let { risk = 'high', open = $bindable(false) }: { risk?: ApprovalRisk; open?: boolean } =
        $props();
    let callback = $state('none');
</script>

{#snippet requestDetails()}
    <dl>
        <dt>Command</dt>
        <dd>bun run deploy</dd>
        <dt>Target</dt>
        <dd>production</dd>
    </dl>
{/snippet}

<Button onclick={() => (open = true)}>Open request</Button>

<ApprovalRequest.Root bind:open {risk}>
    <ApprovalRequest.Content>
        <ApprovalRequest.Header>
            <ApprovalRequest.Status>
                <ApprovalRequest.Icon />
                <ApprovalRequest.Risk />
            </ApprovalRequest.Status>
            <ApprovalRequest.Title>Deploy to production?</ApprovalRequest.Title>
            <ApprovalRequest.Description>
                Requires write access to the production deployment.
            </ApprovalRequest.Description>
        </ApprovalRequest.Header>
        <ApprovalRequest.Details>{@render requestDetails()}</ApprovalRequest.Details>
        <ApprovalRequest.Footer>
            <ApprovalRequest.Cancel onclick={() => (callback = 'deny')}
                >Cancel</ApprovalRequest.Cancel
            >
            <ApprovalRequest.Confirm onclick={() => (callback = 'approve')}>
                Deploy
            </ApprovalRequest.Confirm>
        </ApprovalRequest.Footer>
    </ApprovalRequest.Content>
</ApprovalRequest.Root>

<p data-testid="approval-callback">{callback}</p>
