<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import type { ApprovalRequestRootProps } from '.';
    import { setApprovalRequestContext } from './context.svelte';

    let {
        open = $bindable(false),
        risk = 'medium',
        pending = $bindable<import('.').ApprovalRequestActionName | null>(null),
        error = $bindable<string | null>(null),
        children
    }: ApprovalRequestRootProps = $props();

    let revision = 0;
    let previousOpen = open;

    function clearSession() {
        revision += 1;
        pending = null;
        error = null;
    }

    async function runAction(
        name: import('.').ApprovalRequestActionName,
        handler: ((event: MouseEvent) => unknown | Promise<unknown>) | undefined,
        event: MouseEvent,
        failureMessage = 'Request could not be completed.'
    ) {
        if (pending !== null || !open) {
            return;
        }
        const actionRevision = ++revision;
        error = null;
        pending = name;
        try {
            await handler?.(event);
            if (revision !== actionRevision || !open) {
                return;
            }
            pending = null;
            error = null;
            open = false;
        } catch {
            if (revision !== actionRevision || !open) {
                return;
            }
            pending = null;
            const callerError = error as string | null;
            error = callerError?.trim() ? callerError : failureMessage;
        }
    }

    setApprovalRequestContext({
        get risk() {
            return risk;
        },
        get open() {
            return open;
        },
        get pending() {
            return pending;
        },
        get error() {
            return error;
        },
        runAction(name, handler, event, failureMessage) {
            void runAction(name, handler, event, failureMessage);
        }
    });

    $effect(() => {
        if (!open && previousOpen) {
            clearSession();
        }
        previousOpen = open;
    });
</script>

<AlertDialog.Root bind:open error={risk === 'high'}> {@render children?.()} </AlertDialog.Root>
