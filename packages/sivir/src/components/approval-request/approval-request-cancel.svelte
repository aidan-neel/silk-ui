<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import type { ApprovalRequestActionProps } from '.';
    import { getApprovalRequestContext } from './context.svelte';

    let {
        children,
        onclick,
        pendingLabel = 'Cancelling...',
        failureMessage,
        disabled = false,
        ...rest
    }: ApprovalRequestActionProps = $props();
    const approvalRequest = getApprovalRequestContext();

    function handleClick(event: MouseEvent) {
        approvalRequest.runAction('cancel', onclick, event, failureMessage);
    }
</script>

<AlertDialog.Exit
    {...rest}
    closeOnClick={false}
    disabled={disabled ||
        (approvalRequest.pending !== null && approvalRequest.pending !== 'cancel')}
    status={approvalRequest.pending === 'cancel' ? 'loading' : undefined}
    loadingLabel={pendingLabel}
    onclick={handleClick}
    >{@render children?.()}</AlertDialog.Exit
>
