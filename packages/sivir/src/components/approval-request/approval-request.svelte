<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import type { ApprovalRequestRootProps } from '.';
    import { setApprovalRequestContext } from './context.svelte';

    let { open = $bindable(false), risk = 'medium', children }: ApprovalRequestRootProps = $props();

    setApprovalRequestContext({
        get risk() {
            return risk;
        }
    });
</script>

<AlertDialog.Root bind:open error={risk === 'high'}>
    {@render children?.()}
</AlertDialog.Root>
