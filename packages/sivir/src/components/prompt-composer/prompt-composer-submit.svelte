<script lang="ts">
    import ArrowUp from '@lucide/svelte/icons/arrow-up';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { PromptComposerSubmitProps } from '.';
    import { getPromptComposerContext } from './context.svelte';

    let {
        label = 'Send message',
        stopLabel = 'Stop response',
        element = $bindable(),
        disabled = false,
        class: className,
        onclick,
        ...rest
    }: PromptComposerSubmitProps = $props();

    const context = getPromptComposerContext();
    const submitting = $derived(context.status === 'submitting');
    const isDisabled = $derived(
        context.disabled ||
            disabled ||
            (!submitting && !context.allowEmpty && context.value.trim() === '')
    );
</script>

<Button
    bind:element
    {...rest}
    type={submitting ? 'button' : 'submit'}
    variant="primary"
    size="sm"
    data-ui="prompt-composer-submit"
    data-state={context.status}
    disabled={isDisabled}
    aria-label={submitting ? stopLabel : label}
    onclick={(event: MouseEvent) => {
        onclick?.(event);
        if (!event.defaultPrevented && submitting) context.stop();
    }}
    class={cn(className, 'aspect-square shrink-0 rounded-[var(--radius-md)] px-0')}
>
    <span class="relative grid size-4 place-items-center" aria-hidden="true">
        <ArrowUp
            size={15}
            strokeWidth={2.25}
            class={cn(
                'col-start-1 row-start-1 transition-[opacity,scale] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                submitting ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
            )}
        />
        <LoaderCircle
            size={15}
            strokeWidth={2}
            class={cn(
                'col-start-1 row-start-1 transition-[opacity,scale] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:animate-none motion-reduce:transition-none',
                submitting ? 'scale-100 animate-spin opacity-100' : 'scale-75 opacity-0'
            )}
        />
    </span>
</Button>
