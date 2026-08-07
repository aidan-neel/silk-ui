<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { ToggleGroupContext, ToggleGroupItemProps } from '.';

    let { class: className, value, disabled, children, ...rest }: ToggleGroupItemProps = $props();
    const ctx = getContext<ToggleGroupContext>('toggle-group');

    const active = $derived(ctx.isActive(value));
    const isDisabled = $derived(disabled || ctx.disabled);
</script>

<button
    type="button"
    use:pressable
    data-ui="toggle-group-item"
    data-collection-item
    data-collection-active={ctx.type === 'single' && active}
    data-state={active ? 'on' : 'off'}
    aria-pressed={active}
    disabled={isDisabled}
    onclick={() => ctx.setValue(value)}
    class={cn(
        className,
        'sivir-press inline-flex h-8 select-none items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-3 [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] transition-[background-color,color,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50',
        active
            ? 'bg-secondary text-foreground'
            : 'relative z-10 bg-transparent text-foreground-muted hover:text-foreground'
    )}
    {...rest}
>
    {@render children?.()}
</button>
