<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import type { SwitchProps } from '.';

    let {
        switched = $bindable(false),
        label,
        description,
        disabled = false,
        class: className,
        element = $bindable<HTMLButtonElement>(),
        onclick: userOnclick,
        ...rest
    }: SwitchProps & { onclick?: (e: MouseEvent) => void } = $props();

    const id = $props.id();
    const labelId = `${id}-label`;
    const descriptionId = `${id}-description`;

    const buttonClasses =
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-[0.55]';

    function toggle(event: Event) {
        if (disabled) {
            return;
        }
        switched = !switched;
        userOnclick?.(event as MouseEvent);
    }
</script>

<div class="flex min-h-11 flex-row items-start gap-2.5 md:min-h-0">
    <button
        bind:this={element}
        {...rest as HTMLButtonAttributes}
        type={(rest as HTMLButtonAttributes).type ?? 'button'}
        role="switch"
        aria-label={!label ? (rest as HTMLButtonAttributes)['aria-label'] : undefined}
        aria-checked={switched}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        data-ui="switch"
        data-state={switched ? 'checked' : 'unchecked'}
        {disabled}
        class={cn(
            className,
            buttonClasses,
            switched
                ? 'border-[color-mix(in_srgb,var(--color-primary)_78%,black)] bg-primary'
                : 'border-[color-mix(in_srgb,var(--color-border-strong)_88%,transparent)] bg-[color-mix(in_srgb,var(--color-foreground)_18%,transparent)] dark:bg-[color-mix(in_srgb,var(--color-foreground)_24%,transparent)]'
        )}
        onclick={toggle}
    >
        <span
            aria-hidden="true"
            data-state={switched ? 'checked' : 'unchecked'}
            class={cn(
                'block size-3.5 rounded-full bg-white ring-1 ring-inset ring-black/[0.08] will-change-transform transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                switched ? 'translate-x-4' : 'translate-x-0'
            )}
        ></span>
    </button>

    {#if label || description}
        <div
            class={`flex min-w-0 flex-col gap-0.5 pt-px select-none ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-[var(--ui-cursor-interactive)]'}`}
            onclick={toggle}
            onkeydown={(e) => {
                if (disabled) {
                    return;
                }
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(e);
                    element?.focus();
                }
            }}
            role="presentation"
        >
            {#if label}
                <span
                    id={labelId}
                    class="text-[length:var(--text-sm)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground [font-family:var(--font-sans),sans-serif]"
                >
                    {label}
                </span>
            {/if}
            {#if description}
                <span
                    id={descriptionId}
                    class="leading-6 [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
                >
                    {description}
                </span>
            {/if}
        </div>
    {/if}
</div>
