<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import type { QuestionSubmitProps } from '.';
    import { getQuestionContext } from './context.svelte';

    let {
        label = 'Submit answer',
        loadingLabel = 'Submitting...',
        children,
        disabled = false,
        class: className,
        element = $bindable(),
        onclick,
        'aria-disabled': ariaDisabled,
        ...rest
    }: QuestionSubmitProps = $props();

    const context = getQuestionContext();
    const submitting = $derived(context.status === 'submitting');
</script>

<Button
    bind:element
    {...rest}
    type="submit"
    variant="primary"
    size="md"
    data-ui="question-submit"
    disabled={context.disabled || disabled}
    class={className}
    aria-busy={submitting || undefined}
    aria-disabled={submitting || ariaDisabled}
    onclick={(event: MouseEvent) => {
        if (submitting) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        onclick?.(event as Parameters<NonNullable<typeof onclick>>[0]);
    }}
>
    {#if submitting}
        <Spinner size={14} aria-hidden="true" />
        {loadingLabel}
    {:else if children}
        {@render children()}
    {:else}
        {label}
        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
    {/if}
</Button>
