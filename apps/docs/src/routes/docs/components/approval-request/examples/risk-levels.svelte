<script lang="ts">
    import type { ApprovalRisk } from '@sivir-ui/svelte/components/approval-request';
    import * as ApprovalRequest from '@sivir-ui/svelte/components/approval-request';
    import { Button } from '@sivir-ui/svelte/components/button';

    const requests: Array<{
        risk: ApprovalRisk;
        title: string;
        description: string;
        approveLabel: string;
        denyLabel: string;
    }> = [
        {
            risk: 'low',
            title: 'Read deployment logs?',
            description: 'Access read-only logs for this deployment.',
            approveLabel: 'Read logs',
            denyLabel: 'Skip logs'
        },
        {
            risk: 'medium',
            title: 'Restart the queue worker?',
            description: 'Active jobs may retry on another worker.',
            approveLabel: 'Restart worker',
            denyLabel: 'Keep running'
        },
        {
            risk: 'high',
            title: 'Delete the cache namespace?',
            description: 'Production sessions will be signed out.',
            approveLabel: 'Delete namespace',
            denyLabel: 'Keep namespace'
        }
    ];

    let openStates = $state<Record<ApprovalRisk, boolean>>({
        low: false,
        medium: false,
        high: false
    });
</script>

<div class="flex w-full max-w-xl flex-col gap-3">
    {#each requests as request (request.risk)}
        <Button
            variant="outline"
            class="justify-start"
            onclick={() => (openStates[request.risk] = true)}
        >
            {request.title}
        </Button>
        <ApprovalRequest.Root bind:open={openStates[request.risk]} risk={request.risk}>
            <ApprovalRequest.Content>
                <ApprovalRequest.Header>
                    <ApprovalRequest.Status>
                        <ApprovalRequest.Icon />
                        <ApprovalRequest.Risk />
                    </ApprovalRequest.Status>
                    <ApprovalRequest.Title>{request.title}</ApprovalRequest.Title>
                    <ApprovalRequest.Description>{request.description}</ApprovalRequest.Description>
                </ApprovalRequest.Header>
                <ApprovalRequest.Footer>
                    <ApprovalRequest.Cancel>{request.denyLabel}</ApprovalRequest.Cancel>
                    <ApprovalRequest.Confirm>{request.approveLabel}</ApprovalRequest.Confirm>
                </ApprovalRequest.Footer>
            </ApprovalRequest.Content>
        </ApprovalRequest.Root>
    {/each}
</div>
