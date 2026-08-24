<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
</script>

<div class="grid place-items-center">
    <AlertDialog.Root error>
        <AlertDialog.Trigger variant="destructive">Delete project</AlertDialog.Trigger>
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Delete this project?</AlertDialog.Title>
                <AlertDialog.Description>
                    All branches, issues, and deploy history will be permanently removed.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>Cancel</AlertDialog.Exit>
                <AlertDialog.Confirm>Delete project</AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
