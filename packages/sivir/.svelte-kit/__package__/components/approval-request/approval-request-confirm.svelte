<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import type { ApprovalRequestActionProps } from '.';
    import { getApprovalRequestContext } from './context.svelte';

    let {
        children,
        onclick,
        pendingLabel = 'Approving...',
        failureMessage,
        disabled = false,
        ...rest
    }: ApprovalRequestActionProps = $props();
    const approvalRequest = getApprovalRequestContext();

    function handleClick(event: MouseEvent) {
        approvalRequest.runAction('confirm', onclick, event, failureMessage);
    }
</script>

<AlertDialog.Confirm
    {...rest}
    closeOnClick={false}
    disabled={disabled ||
        (approvalRequest.pending !== null && approvalRequest.pending !== 'confirm')}
    status={approvalRequest.pending === 'confirm' ? 'loading' : undefined}
    loadingLabel={pendingLabel}
    onclick={handleClick}>{@render children?.()}</AlertDialog.Confirm
>
