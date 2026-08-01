<script lang="ts">
    import Paperclip from '@lucide/svelte/icons/paperclip';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentTriggerProps } from '.';
    import { getAttachmentContext } from './context.svelte';

    let {
        children,
        element = $bindable(),
        disabled = false,
        class: className,
        'aria-label': ariaLabel = 'Add attachments',
        variant = 'ghost',
        size = children ? 'sm' : 'icon',
        onclick,
        ...rest
    }: AttachmentTriggerProps = $props();

    const context = getAttachmentContext();
</script>

<Button
    bind:element
    {...rest}
    type="button"
    {variant}
    {size}
    data-ui="attachment-trigger"
    data-state={context.disabled || disabled ? 'disabled' : 'idle'}
    aria-label={ariaLabel}
    disabled={context.disabled || disabled}
    onclick={(event: MouseEvent) => {
        onclick?.(event);
        if (!event.defaultPrevented) context.open();
    }}
    class={cn(className, 'rounded-[var(--radius-md)] text-foreground-muted hover:text-foreground')}
>
    <Paperclip size={17} strokeWidth={2} aria-hidden="true" />
    {@render children?.()}
</Button>
