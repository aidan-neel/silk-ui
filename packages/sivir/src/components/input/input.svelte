<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { HTMLInputAttributes } from 'svelte/elements';
    import { input } from './variants';

    let {
        placeholder,
        label,
        description,
        type = 'text',
        variant = 'outline',
        class: classProp,
        element = $bindable<HTMLInputElement>(),
        value = $bindable<string | number | boolean | FileList | undefined>(),
        checked = $bindable<boolean | undefined>(),
        files = $bindable<FileList | undefined>(),
        ...rest
    }: {
        placeholder?: string;
        label?: string;
        description?: string;
        type?: string;
        variant?: 'outline' | 'secondary';
        class?: string;
        element?: HTMLInputElement | undefined;
        value?: string | number | boolean | FileList | undefined;
        checked?: boolean | undefined;
        files?: FileList | undefined;
    } & HTMLInputAttributes = $props();
</script>

<label class="flex w-full flex-col gap-1">
    {#if label}
        <span
            class="text-[length:var(--text-sm)] mb-0.5 select-none [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-none text-foreground [font-family:var(--font-sans),sans-serif]"
            >{label}</span
        >
    {/if}

    {#if type === 'file'}
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
    {:else if type === 'checkbox'}
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

    {#if description}
        <span
            class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
            >{description}</span
        >
    {/if}
</label>
