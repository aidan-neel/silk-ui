<script lang="ts">
import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
import type { ApprovalRequestTitleProps } from '.';

let { children, ...rest }: ApprovalRequestTitleProps = $props();
</script>

<AlertDialog.Title {...rest}>{@render children?.()}</AlertDialog.Title>
