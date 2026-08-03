<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import type { ApprovalRequestFooterProps } from '.';

    let { children, ...rest }: ApprovalRequestFooterProps = $props();
</script>

<AlertDialog.Footer {...rest}>{@render children?.()}</AlertDialog.Footer>
