<script lang="ts">
    import Trash from '@lucide/svelte/icons/trash-2';
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<div class="grid place-items-center">
    <AlertDialog.Root error orientation="vertical">
        <AlertDialog.Trigger variant="destructive">
            <Trash size={14} />
            Delete workspace
        </AlertDialog.Trigger>
        <AlertDialog.Content size="lg">
            <AlertDialog.Header>
                <div class="flex items-center gap-2.5">
                    <Trash size={18} class="text-[var(--color-error)]" />
                    <AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
                </div>
                <AlertDialog.Description>
                    All projects, comments, and exports will be removed. This action cannot be
                    undone.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>
                    Cancel
                    <Shortcut shortcut="esc" />
                </AlertDialog.Exit>
                <AlertDialog.Confirm>
                    Delete
                    <Shortcut shortcut="enter" />
                </AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
