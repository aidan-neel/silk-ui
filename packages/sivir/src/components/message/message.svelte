<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { MessageRootProps } from '.';
    import { type MessageContext, setMessageContext } from './context.svelte';

    let {
        from = 'assistant',
        status = 'idle',
        name,
        timestamp,
        avatar,
        children,
        class: className,
        ...rest
    }: MessageRootProps = $props();

    const message: MessageContext = {
        get from() {
            return from;
        },
        get status() {
            return status;
        }
    };

    setMessageContext(message);
</script>

<article
    {...rest}
    data-ui="message"
    data-from={from}
    data-state={status}
    aria-busy={status === 'streaming'}
    class={cn(
        className,
        'group/message flex w-full min-w-0 gap-3',
        from === 'user'
            ? 'flex-row-reverse items-start'
            : from === 'system'
              ? 'items-center justify-center'
              : 'items-start'
    )}
>
    {#if avatar}
        <div data-ui="message-avatar" class="mt-0.5 shrink-0">
            {@render avatar()}
        </div>
    {/if}

    <div
        class={cn(
            'flex min-w-0 max-w-full flex-col gap-1.5',
            from === 'user'
                ? 'max-w-[90%] items-end sm:max-w-2xl'
                : from === 'system'
                  ? 'w-full max-w-3xl items-center text-center'
                  : 'flex-1 items-start'
        )}
    >
        {#if name || timestamp || status === 'error'}
            <header
                data-ui="message-metadata"
                class={cn(
                    'flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-0.5 text-xs text-foreground-muted',
                    from === 'user' && 'justify-end',
                    from === 'system' && 'justify-center'
                )}
            >
                {#if name}
                    <span class="truncate font-[var(--font-weight-label)]">{name}</span>
                {/if}
                {#if timestamp}
                    <time class="shrink-0 tabular-nums">{timestamp}</time>
                {/if}
                {#if status === 'error'}
                    <span
                        data-ui="message-error"
                        class="inline-flex items-center gap-1 text-[var(--color-error)]"
                    >
                        <span aria-hidden="true">!</span>
                        Failed
                    </span>
                {/if}
            </header>
        {/if}

        {@render children?.()}
    </div>
</article>
