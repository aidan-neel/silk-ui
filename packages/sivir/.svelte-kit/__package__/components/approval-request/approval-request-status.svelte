<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ApprovalRequestStatusProps } from '.';

    let { class: className, children, ...rest }: ApprovalRequestStatusProps = $props();
</script>

<div
    {...rest}
    data-ui="approval-request-status"
    class={cn(className, 'mb-2.5 flex items-center justify-between gap-3')}
>
    {@render children?.()}
</div>
