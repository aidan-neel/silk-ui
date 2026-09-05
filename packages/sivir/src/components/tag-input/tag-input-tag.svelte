<script lang="ts">
    import X from '@lucide/svelte/icons/x';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { TagInputTagProps } from '.';
    import { getTagInputContext } from './context.svelte';

    let {
        value,
        index,
        removable = true,
        onRemove,
        class: className,
        children,
        ...rest
    }: TagInputTagProps = $props();

    const context = getTagInputContext();
    const canRemove = $derived(removable && !context.disabled);

    function remove() {
        if (onRemove) {
            onRemove(value);

            return;
        }

        if (index !== undefined) {
            context.removeAt(index);

            return;
        }

        context.removeValue(value);
    }

    function handleRemove(event: MouseEvent) {
        event.stopPropagation();

        if (!canRemove) {
            return;
        }

        remove();
        context.focusInput();
    }
</script>

{#snippet label()}
    <span class="min-w-0 flex-1 truncate">
        {#if children}
            {@render children()}
        {:else}
            {value}
        {/if}
    </span>
    {#if canRemove}
        <span
            data-ui="tag-input-tag-remove"
            aria-hidden="true"
            class="grid size-5 shrink-0 place-items-center rounded-full text-foreground-muted transition-colors group-hover:text-foreground"
        >
            <X size={12} strokeWidth={2.25} aria-hidden="true" class="size-3" />
        </span>
    {/if}
{/snippet}

{#if canRemove}
    <Button
        {...rest}
        type="button"
        variant="secondary"
        size="sm"
        data-ui="tag-input-tag"
        aria-label={`Remove ${value}`}
        title={`Remove ${value}`}
        onclick={handleRemove}
        class={cn(
            className,
            'group h-auto max-w-full gap-1.5 rounded-[var(--radius-md)] px-0 py-1 pr-1.5 pl-2.5 [font-size:var(--font-size-body)] leading-tight [font-weight:var(--font-weight-badge)] [letter-spacing:var(--tracking-body)]'
        )}
    >
        {@render label()}
    </Button>
{:else}
    <span
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
        data-ui="tag-input-tag"
        data-disabled={context.disabled || undefined}
        class={cn(
            className,
            'inline-flex max-w-full items-center gap-1.5 rounded-[var(--radius-md)] bg-secondary py-1 pr-2.5 pl-2.5 [font-size:var(--font-size-body)] leading-tight [font-weight:var(--font-weight-badge)] [letter-spacing:var(--tracking-body)] text-foreground'
        )}
    >
        {@render label()}
    </span>
{/if}
