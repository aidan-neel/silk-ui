<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<div class="grid place-items-center">
    <AlertDialog.Root>
        <AlertDialog.Trigger variant="outline">Sign out</AlertDialog.Trigger>
        <AlertDialog.Content size="lg">
            <AlertDialog.Header>
                <AlertDialog.Title>Sign out?</AlertDialog.Title>
                <AlertDialog.Description>
                    You'll need to sign in again to resume your session.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>
                    Stay
                    <Shortcut shortcut="esc" />
                </AlertDialog.Exit>
                <AlertDialog.Confirm>
                    Sign out
                    <Shortcut shortcut="enter" />
                </AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
