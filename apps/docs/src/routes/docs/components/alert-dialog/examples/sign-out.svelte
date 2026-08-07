<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
</script>

<div class="grid place-items-center">
    <AlertDialog.Root>
        <AlertDialog.Trigger variant="outline">Sign out</AlertDialog.Trigger>
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Sign out?</AlertDialog.Title>
                <AlertDialog.Description>
                    You'll need to sign in again to resume your session.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>Stay</AlertDialog.Exit>
                <AlertDialog.Confirm>Sign out</AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
