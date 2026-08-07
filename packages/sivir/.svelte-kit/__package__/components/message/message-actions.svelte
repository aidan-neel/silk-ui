<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { MessageActionsProps } from '.';
    import { getMessageContext } from './context.svelte';

    let {
        children,
        class: className,
        'aria-label': ariaLabel = 'Message actions',
        ...rest
    }: MessageActionsProps = $props();
    const message = getMessageContext();
</script>

<div
    {...rest}
    data-ui="message-actions"
    data-from={message.from}
    data-state={message.status}
    role="toolbar"
    aria-label={ariaLabel}
    class={cn(
        className,
        'sivir-message-actions flex min-h-8 max-w-full flex-wrap items-center gap-1 text-foreground-muted',
        message.from === 'user'
            ? 'justify-end'
            : message.from === 'system'
              ? 'justify-center'
              : 'justify-start'
    )}
>
    {@render children?.()}
</div>

<style>
    @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
        .sivir-message-actions {
            opacity: 0;
            transition-property: opacity;
            transition-duration: var(--motion-duration-hover);
            transition-timing-function: var(--ease-out);
        }

        :global([data-ui='message']:hover) .sivir-message-actions,
        .sivir-message-actions:focus-within {
            opacity: 1;
        }
    }
</style>
