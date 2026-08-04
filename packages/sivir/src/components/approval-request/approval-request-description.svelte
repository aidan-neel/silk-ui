<script lang="ts">
import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
import type { ApprovalRequestDescriptionProps } from '.';

let { children, ...rest }: ApprovalRequestDescriptionProps = $props();
</script>

<AlertDialog.Description {...rest}>{@render children?.()}</AlertDialog.Description>
