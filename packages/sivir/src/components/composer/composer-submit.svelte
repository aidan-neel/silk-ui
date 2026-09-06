<script lang="ts">
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import Square from '@lucide/svelte/icons/square';
    import { Button } from '@sivir-ui/svelte/components/button';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ComposerSubmitProps } from '.';
    import { getComposerContext } from './context.svelte';

    let {
        label = 'Send',
        queueLabel = 'Queue message',
        stopLabel = 'Stop response',
        children,
        element = $bindable(),
        disabled = false,
        class: className,
        onclick,
        ...rest
    }: ComposerSubmitProps = $props();

    const context = getComposerContext();
    const empty = $derived(context.value.trim() === '');
    const action = $derived.by(() => {
        if (context.pending) {
            return 'pending';
        }
        if (context.generating === undefined && context.status === 'submitting') {
            return 'stop';
        }
        if (context.generating) {
            return empty ? 'stop' : 'queue';
        }
        return 'send';
    });
    const isDisabled = $derived(
        context.disabled ||
            disabled ||
            (action === 'send' && !context.allowEmpty && empty) ||
            action === 'pending'
    );
    const actionLabel = $derived(
        action === 'stop' ? stopLabel : action === 'queue' ? queueLabel : label
    );

    function handleClick(event: MouseEvent) {
        onclick?.(event);
        if (!event.defaultPrevented && action === 'stop') {
            context.stop();
        }
    }
</script>

<Button
    bind:element
    {...rest}
    type={action === 'stop' || action === 'pending' ? 'button' : 'submit'}
    variant="primary"
    data-ui="composer-submit"
    data-state={action}
    disabled={isDisabled}
    aria-label={actionLabel}
    onclick={handleClick}
    class={cn(className, 'shrink-0 px-3')}
>
    {#if children}
        {@render children({ action, generating: context.generating ?? false, empty })}
    {:else if action === 'pending'}
        <LoaderCircle
            size={15}
            strokeWidth={2}
            class="animate-spin motion-reduce:animate-none"
            aria-hidden="true"
        />
    {:else if action === 'stop'}
        <Square size={8} fill="currentColor" aria-hidden="true" />
        Stop
    {:else}
        Send
        <Shortcut shortcut="enter" />
    {/if}
</Button>
