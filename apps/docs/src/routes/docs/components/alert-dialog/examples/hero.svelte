<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import Trash from '@lucide/svelte/icons/trash-2';
</script>

<div class="grid place-items-center">
    <AlertDialog.Root error>
        <AlertDialog.Trigger variant="destructive">
            <Trash size={14} />
            Delete workspace
        </AlertDialog.Trigger>
        <AlertDialog.Content class="max-w-[28rem]">
            <AlertDialog.Header>
                <AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
                <AlertDialog.Description>
                    All projects, comments, and exports will be removed. This action cannot be
                    undone.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>Cancel</AlertDialog.Exit>
                <AlertDialog.Confirm>Delete</AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
