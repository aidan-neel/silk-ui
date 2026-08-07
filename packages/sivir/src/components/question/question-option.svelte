<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionOptionProps } from '.';
    import { getQuestionContext } from './context.svelte';

    let {
        value,
        label,
        description,
        disabled = false,
        element = $bindable(),
        class: className,
        onchange,
        ...rest
    }: QuestionOptionProps = $props();

    const context = getQuestionContext();
    const selected = $derived(context.isSelected(value));
    const isDisabled = $derived(context.disabled || context.busy || disabled);
    const inputType = $derived(context.type === 'multiple' ? 'checkbox' : 'radio');

    function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
        context.select(value);
        onchange?.(event);
    }
</script>

{#if context.type !== 'text'}
    <label
        data-ui="question-option"
        data-state={selected ? 'checked' : 'unchecked'}
        data-disabled={isDisabled || undefined}
        class={cn(
            className,
            'group relative flex min-h-12 cursor-[var(--ui-cursor-interactive)] items-start gap-3 rounded-[var(--radius-lg)] border px-3 py-2.5 text-start transition-[background-color,border-color,box-shadow,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none has-[:focus-visible]:shadow-[var(--focus-ring)]',
            selected
                ? 'border-primary/60 bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-card))]'
                : 'border-border bg-background hover:border-border-strong hover:bg-secondary/35',
            isDisabled && 'cursor-not-allowed opacity-50'
        )}
    >
        <input
            bind:this={element}
            {...rest}
            data-question-control
            data-ui="question-option-input"
            type={inputType}
            name={context.name}
            {value}
            checked={selected}
            disabled={isDisabled}
            required={context.required && context.type === 'single'}
            aria-invalid={Boolean(context.validationMessage)}
            onchange={handleChange}
            class="peer sr-only"
        />
        <span
            class={cn(
                'mt-0.5 grid size-4 shrink-0 place-items-center border transition-[background-color,border-color] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                context.type === 'multiple' ? 'rounded-[var(--radius-sm)]' : 'rounded-full',
                selected ? 'border-primary bg-primary' : 'border-border bg-background'
            )}
            aria-hidden="true"
        >
            {#if context.type === 'multiple'}
                <Check
                    size={11}
                    strokeWidth={2.5}
                    class={cn(
                        'text-[var(--color-on-primary)] transition-[opacity,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                        selected ? 'scale-100 opacity-100' : 'scale-[0.25] opacity-0'
                    )}
                />
            {:else}
                <span
                    class={cn(
                        'size-1.5 rounded-full bg-[var(--color-on-primary)] transition-[opacity,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                        selected ? 'scale-100 opacity-100' : 'scale-[0.25] opacity-0'
                    )}
                ></span>
            {/if}
        </span>
        <span class="min-w-0 flex-1">
            <span
                class="block [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-snug text-foreground"
            >
                {label}
            </span>
            {#if description}
                <span
                    class="mt-0.5 block [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] leading-snug text-foreground-muted"
                >
                    {description}
                </span>
            {/if}
        </span>
    </label>
{/if}
