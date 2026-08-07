<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Component, Snippet } from 'svelte';
    import { badge } from './variants';

    let {
        variant = 'secondary',
        children,
        class: classProp,
        href,
        icon: Icon,
        iconSize = 13,
        dot = false,
        ...rest
    }: {
        variant?:
            | 'primary'
            | 'secondary'
            | 'ghost'
            | 'outline'
            | 'destructive'
            | 'info'
            | 'success'
            | 'warning'
            | 'error';
        children?: Snippet;
        class?: string;
        href?: string;
        icon?: Component<{ size?: number | string; class?: string }>;
        iconSize?: number | string;
        dot?: boolean;
    } & Record<string, unknown> = $props();
</script>

{#snippet inner()}
    {#if Icon}
        <Icon size={iconSize} class="text-foreground-muted" />
    {/if}
    {#if dot}
        <span
            data-badge-dot
            aria-hidden="true"
            class="size-1.5 shrink-0 rounded-full bg-current opacity-60"
        ></span>
    {/if}
    {@render children?.()}
{/snippet}

{#if href}
    <a
        data-ui="badge"
        data-variant={variant}
        {href}
        class={cn(classProp, badge({ variant }))}
        {...rest}
    >
        {@render inner()}
    </a>
{:else}
    <div
        data-ui="badge"
        data-variant={variant}
        role="status"
        class={cn(classProp, badge({ variant }))}
        {...rest}
    >
        {@render inner()}
    </div>
{/if}
