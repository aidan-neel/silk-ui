<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import type { ApprovalRequestActionProps } from '.';

    let { children, ...rest }: ApprovalRequestActionProps = $props();
</script>

<AlertDialog.Exit {...rest}>{@render children?.()}</AlertDialog.Exit>
