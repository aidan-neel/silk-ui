<script lang="ts">
import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
import type { ApprovalRequestHeaderProps } from '.';

let { class: className, children, ...rest }: ApprovalRequestHeaderProps = $props();
</script>

<AlertDialog.Header {...rest} class={className}>
    {@render children?.()}
</AlertDialog.Header>
