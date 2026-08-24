<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { RadioGroupContext, RadioGroupItemProps } from '.';

    let {
        class: className,
        value,
        disabled,
        label,
        description,
        id,
        ...rest
    }: RadioGroupItemProps = $props();

    const ctx = getContext<RadioGroupContext>('radio-group');
    const selected = $derived(ctx.isSelected(value));
    const isDisabled = $derived(disabled || ctx.disabled);
    const inputId = $derived(id ?? `radio-${value}`);
</script>

<label
    for={inputId}
    class={cn(
        className,
        'flex min-h-11 cursor-[var(--ui-cursor-interactive)] items-start gap-2.5 md:min-h-0',
        isDisabled && 'cursor-not-allowed opacity-50'
    )}
>
    <!-- Single ring: border crossfades; dot scales in (same motion as checkbox). -->
    <span
        use:pressable
        data-ui="radio-group-item"
        data-state={selected ? 'checked' : 'unchecked'}
        class={cn(
            'sivir-press mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border bg-background transition-[background-color,border-color,box-shadow,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:shadow-[var(--focus-ring)]',
            selected ? 'border-primary' : 'border-border',
            !isDisabled && !selected && 'hover:border-primary'
        )}
        aria-hidden="true"
    >
        <span
            class={cn(
                'size-2 rounded-full bg-primary transition-[opacity,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                selected ? 'scale-100 opacity-100' : 'scale-[0.25] opacity-0'
            )}
        ></span>
    </span>
    <input
        type="radio"
        id={inputId}
        name={ctx.name}
        {value}
        checked={selected}
        disabled={isDisabled}
        onchange={() => ctx.setValue(value)}
        class="sr-only"
        {...rest}
    />
    {#if label || description}
        <span class="flex flex-col gap-0.5 leading-tight">
            {#if label}
                <span
                    class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
                    >{label}</span
                >
            {/if}
            {#if description}
                <span
                    class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
                    >{description}</span
                >
            {/if}
        </span>
    {/if}
</label>
