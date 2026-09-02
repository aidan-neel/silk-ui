<script lang="ts">
    import { input } from '@sivir-ui/svelte/components/input/variants';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TextareaProps } from '.';

    let {
        placeholder,
        label,
        description,
        variant = 'outline',
        autoresize = false,
        class: classProp,
        children,
        element = $bindable<HTMLTextAreaElement>(),
        value = $bindable<string | number | null | undefined>(),
        oninput,
        ...rest
    }: TextareaProps = $props();

    function resize() {
        if (!autoresize || !element) {
            return;
        }
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }

    $effect(() => {
        if (autoresize) {
            value;
            resize();
        }
    });

    const composerClass = $derived(
        variant === 'secondary'
            ? 'border-transparent bg-secondary focus-within:border-[color-mix(in_srgb,var(--color-secondary)_45%,var(--color-primary))]'
            : 'border-[var(--color-input)] bg-[var(--color-field)] focus-within:border-primary'
    );
</script>

{#snippet field()}
    <textarea
        bind:this={element}
        bind:value
        oninput={(event) => {
            oninput?.(event);
            resize();
        }}
        data-ui="textarea"
        data-variant={variant}
        class={cn(
            classProp,
            children && 'rounded-none border-0 bg-transparent focus-visible:shadow-none',
            autoresize && 'resize-none overflow-y-hidden',
            'min-h-16 resize-y py-2.5 leading-body',
            input({ variant })
        )}
        {...rest}
        {placeholder}
    ></textarea>
{/snippet}

{#snippet control()}
    {#if children}
        <div
            data-ui="textarea-composer"
            data-variant={variant}
            class={cn(
                'overflow-hidden rounded-[var(--radius-xl)] border transition-[border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] focus-within:shadow-[var(--focus-ring)]',
                composerClass
            )}
        >
            {@render field()}
            {@render children()}
        </div>
    {:else}
        {@render field()}
    {/if}
{/snippet}

{#snippet meta()}
    {#if label}
        <span
            class="[font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] text-foreground [font-family:var(--font-sans),sans-serif]"
        >
            {label}
        </span>
    {/if}
    {@render control()}
    {#if description}
        <span
            class="[font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground-muted"
            >{description}</span
        >
    {/if}
{/snippet}

{#if label}
    <label class="flex flex-col gap-1"> {@render meta()} </label>
{:else if description}
    <div class="flex flex-col gap-1">
        {@render meta()}
    </div>
{:else}
    {@render control()}
{/if}
