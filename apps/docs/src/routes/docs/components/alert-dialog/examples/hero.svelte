<script lang="ts">
    import Trash from '@lucide/svelte/icons/trash-2';
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
</script>

<div class="grid place-items-center">
    <AlertDialog.Root error orientation="vertical">
        <AlertDialog.Trigger variant="destructive">
            <Trash size={14} />
            Delete workspace
        </AlertDialog.Trigger>
        <AlertDialog.Content>
            <AlertDialog.Header>
                <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-error/20 bg-error/10 text-error"
                >
                    <Trash size={16} />
                </div>
                <div class="flex flex-col gap-1.5">
                    <AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
                    <AlertDialog.Description>
                        All projects, comments, and exports will be removed. This action cannot be
                        undone.
                    </AlertDialog.Description>
                </div>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>Cancel</AlertDialog.Exit>
                <AlertDialog.Confirm>Delete</AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
