<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { MessageContentProps } from '.';
    import { getMessageContext } from './context.svelte';

    let { children, class: className, ...rest }: MessageContentProps = $props();
    const message = getMessageContext();
</script>

<div
    {...rest}
    data-ui="message-content"
    data-from={message.from}
    data-state={message.status}
    class={cn(
        className,
        'min-w-0 max-w-full select-text [overflow-wrap:anywhere]',
        message.from === 'user'
            ? 'rounded-[var(--radius-lg)] bg-secondary/70 px-3 py-1.5 text-sm leading-6 font-medium text-foreground'
            : message.from === 'system'
              ? 'max-w-[65ch] px-3 py-1.5 text-sm leading-6 text-foreground-muted'
              : 'w-full max-w-[65ch] leading-7 text-foreground'
    )}
>
    {@render children?.()}
</div>
