<script lang="ts">
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import { getApprovalRequestContext } from './context.svelte';

let { children, class: className }: { children?: Snippet } & DefaultProps = $props();
const approvalRequest = getApprovalRequestContext();
</script>

<div data-ui="approval-request-error" role="alert" aria-live="assertive" class={className}>
    {#if children}
        {@render children()}
    {:else}
        {approvalRequest.error ?? ''}
    {/if}
</div>
