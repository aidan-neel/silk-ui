<script lang="ts">
    import LockKeyhole from '@lucide/svelte/icons/lock-keyhole';
    import Shield from '@lucide/svelte/icons/shield';
    import ShieldAlert from '@lucide/svelte/icons/shield-alert';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ApprovalRequestIconProps } from '.';
    import { getApprovalRequestContext } from './context.svelte';

    let { class: className, children, ...rest }: ApprovalRequestIconProps = $props();
    const approvalRequest = getApprovalRequestContext();
</script>

<div
    {...rest}
    data-ui="approval-request-icon"
    aria-hidden="true"
    class={cn(
        className,
        'flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-foreground-muted [&_svg]:size-4',
        approvalRequest.risk === 'high' &&
            'bg-[color-mix(in_oklab,var(--color-warning)_12%,transparent)] text-[var(--color-warning)]'
    )}
>
    {#if children}
        {@render children()}
    {:else if approvalRequest.risk === 'high'}
        <ShieldAlert strokeWidth={2} />
    {:else if approvalRequest.risk === 'low'}
        <Shield strokeWidth={2} />
    {:else}
        <LockKeyhole strokeWidth={2} />
    {/if}
</div>
