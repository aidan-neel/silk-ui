<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import type { ApprovalRequestContentProps } from '.';
    import { getApprovalRequestContext } from './context.svelte';

    let { class: className, children, ...rest }: ApprovalRequestContentProps = $props();
    const approvalRequest = getApprovalRequestContext();
</script>

<AlertDialog.Content
    {...rest}
    size="lg"
    showClose={false}
    data-ui="approval-request"
    data-risk={approvalRequest.risk}
    class={className}
>
    {@render children?.()}
</AlertDialog.Content>
