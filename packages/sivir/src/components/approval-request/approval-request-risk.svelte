<script lang="ts">
import { Badge } from '@sivir-ui/svelte/components/badge';
import { cn } from '@sivir-ui/svelte/utils';
import type { ApprovalRequestRiskProps } from '.';
import { getApprovalRequestContext } from './context.svelte';

let { class: className, children, ...rest }: ApprovalRequestRiskProps = $props();
const approvalRequest = getApprovalRequestContext();
const label = $derived(
    approvalRequest.risk === 'low'
        ? 'Low risk'
        : approvalRequest.risk === 'high'
          ? 'High risk'
          : 'Medium risk'
);
</script>

<Badge
    {...rest}
    variant={approvalRequest.risk === 'high' ? 'destructive' : 'secondary'}
    class={cn(className, 'shrink-0')}
>
    {#if children}
        {@render children()}
    {:else}
        {label}
    {/if}
</Badge>
