<script lang="ts">
    import MessageCircle from '@lucide/svelte/icons/message-circle';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ConversationEmptyProps } from '.';

    let {
        icon,
        title = 'Start a conversation',
        description = 'Ask a question or share what you are working on.',
        action,
        children,
        class: className,
        ...rest
    }: ConversationEmptyProps = $props();
</script>

<div
    {...rest}
    data-ui="conversation-empty"
    data-state="empty"
    class={cn(className, 'grid min-h-48 w-full place-items-center px-6 py-10 text-center')}
>
    {#if children}
        {@render children()}
    {:else}
        <div class="flex max-w-sm flex-col items-center">
            <div
                class="mb-4 flex size-10 items-center justify-center rounded-[var(--radius-xl)] bg-secondary text-foreground-muted"
            >
                {#if icon}
                    {@render icon()}
                {:else}
                    <MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />
                {/if}
            </div>
            {#if title}
                <p class="font-[var(--font-weight-label)] text-foreground">{title}</p>
            {/if}
            {#if description}
                <p class="mt-1 max-w-xs text-sm leading-6 text-foreground-muted">{description}</p>
            {/if}
            {#if action}
                <div class="mt-4">{@render action()}</div>
            {/if}
        </div>
    {/if}
</div>
