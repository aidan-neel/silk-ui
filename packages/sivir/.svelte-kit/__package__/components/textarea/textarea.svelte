<script lang="ts">
    import { input } from '@sivir-ui/svelte/components/input/variants';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import type { HTMLTextareaAttributes } from 'svelte/elements';

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
    }: {
        placeholder?: string;
        label?: string;
        description?: string;
        variant?: 'outline' | 'secondary';
        autoresize?: boolean;
        class?: string;
        children?: Snippet;
        element?: HTMLTextAreaElement | undefined;
        value?: string | number | null | undefined;
    } & HTMLTextareaAttributes = $props();

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

<label class="flex flex-col gap-1">
    {#if label}
        <span
            class="text-[length:var(--text-sm)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground [font-family:var(--font-sans),sans-serif]"
        >
            {label}
        </span>
    {/if}

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
                'min-h-16 resize-y py-2.5 leading-6',
                input({ variant })
            )}
            {...rest}
            {placeholder}
        ></textarea>
    {/snippet}

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

    {#if description}
        <span
            class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
            >{description}</span
        >
    {/if}
</label>
