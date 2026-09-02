<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { InputProps } from '.';
    import { input } from './variants';

    const nonAdornableInputTypes = new Set([
        'button',
        'checkbox',
        'color',
        'file',
        'hidden',
        'image',
        'radio',
        'range',
        'reset',
        'submit'
    ]);
    const adornedInputClass =
        'flex min-h-0 min-w-0 flex-1 self-stretch rounded-none border-0 bg-transparent px-0 py-0 text-base text-[var(--color-field-foreground)] [font-size:var(--font-size-body)] shadow-none outline-none placeholder:text-foreground-muted focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none disabled:cursor-not-allowed disabled:opacity-100 md:text-sm';

    let {
        placeholder,
        label,
        description,
        type = 'text',
        variant = 'outline',
        class: classProp,
        leading,
        trailing,
        element = $bindable<HTMLInputElement>(),
        value = $bindable<string | number | boolean | FileList | undefined>(),
        checked = $bindable<boolean | undefined>(),
        files = $bindable<FileList | undefined>(),
        ...rest
    }: InputProps = $props();

    const normalizedType = $derived(type.toLowerCase());
    const hasAdornment = $derived(
        !nonAdornableInputTypes.has(normalizedType) && Boolean(leading || trailing)
    );
    const controlClass = $derived(
        variant === 'secondary'
            ? 'border-transparent bg-secondary has-[:focus-visible]:border-[color-mix(in_srgb,var(--color-secondary)_45%,var(--color-primary))]'
            : 'border-[var(--color-input)] bg-[var(--color-field)] has-[:focus-visible]:border-primary'
    );
</script>

{#snippet field()}
    {#if hasAdornment}
        <span
            data-ui="input-control"
            data-variant={variant}
            class={cn(
                // token-lint-disable-next-line no-primitive-leak: density-aware control spacing
                'flex min-h-[var(--size-control-md)] w-full items-center gap-[var(--sivir-space-2)] rounded-[var(--radius-lg)] border px-[var(--sivir-space-3)] text-[var(--color-field-foreground)] transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none has-[:focus-visible]:shadow-[var(--focus-ring)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-[0.55]',
                controlClass
            )}
        >
            {#if leading}
                <span
                    data-ui="input-leading"
                    class="pointer-events-none flex shrink-0 select-none items-center text-foreground-muted [font-size:var(--font-size-body)] [&_svg]:size-4 [&_svg]:shrink-0"
                >
                    {@render leading()}
                </span>
            {/if}

            <input
                bind:this={element}
                bind:value
                {type}
                data-ui="input"
                data-variant={variant}
                class={cn(classProp, adornedInputClass)}
                {...rest}
                {placeholder}
            />

            {#if trailing}
                <span
                    data-ui="input-trailing"
                    class="pointer-events-none flex shrink-0 select-none items-center text-foreground-muted [font-size:var(--font-size-body)] [&_svg]:size-4 [&_svg]:shrink-0"
                >
                    {@render trailing()}
                </span>
            {/if}
        </span>
    {:else if normalizedType === 'file'}
        <input
            bind:this={element}
            bind:value
            bind:files
            type="file"
            data-ui="input"
            data-variant={variant}
            class={cn(classProp, input({ variant }))}
            {...rest}
            {placeholder}
        />
    {:else if normalizedType === 'checkbox'}
        <input
            bind:this={element}
            bind:checked
            type="checkbox"
            data-ui="input"
            data-variant={variant}
            class={cn(classProp, input({ variant }))}
            {...rest}
            {placeholder}
        />
    {:else}
        <input
            bind:this={element}
            bind:value
            {type}
            data-ui="input"
            data-variant={variant}
            class={cn(classProp, input({ variant }))}
            {...rest}
            {placeholder}
        />
    {/if}
{/snippet}

{#snippet meta()}
    {#if label}
        <span
            class="text-[length:var(--text-sm)] mb-0.5 select-none [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-none text-foreground [font-family:var(--font-sans),sans-serif]"
            >{label}</span
        >
    {/if}
    {@render field()}
    {#if description}
        <span
            class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
            >{description}</span
        >
    {/if}
{/snippet}

{#if label}
    <label class="flex w-full flex-col gap-1"> {@render meta()} </label>
{:else if description}
    <div class="flex w-full flex-col gap-1">
        {@render meta()}
    </div>
{:else}
    {@render field()}
{/if}
