<!-- token-lint-disable-file -->
<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { TabsState, TabsTriggerProps } from '.';
    import { toTabIdPart } from './id';

    let {
        children,
        class: className,
        value,
        disabled = false,
        ...rest
    }: TabsTriggerProps = $props();

    const tabsState = getContext<TabsState>('tabs');

    const triggerId = $derived(`${tabsState.id}-trigger-${toTabIdPart(value)}`);
    const contentId = $derived(`${tabsState.id}-content-${toTabIdPart(value)}`);
    const active = $derived(tabsState.value === value);
    /**
     * `ghost` has no active pill or underline, so a heavier weight -- plus the
     * text-colour shift below -- is what marks the active tab.
     */
    const ghostActive = $derived(active && tabsState.variant === 'ghost');

    /**
     * Segmented pills sit taller than their text padding, so the extra
     * flex-centring below keeps the label vertically centred inside the taller pill.
     */
    const segmented = $derived(tabsState.variant === 'segmented');
</script>

<button
    type="button"
    use:pressable
    role="tab"
    id={triggerId}
    aria-selected={active}
    aria-controls={contentId}
    tabindex={active ? 0 : -1}
    data-ui="tabs-trigger"
    data-state={active ? 'active' : 'inactive'}
    {disabled}
    class={cn(
        className,
        'sivir-press relative z-10 select-none rounded-[var(--radius-lg)] hover:cursor-[var(--ui-cursor-interactive)] px-[var(--sivir-space-3)] py-[var(--sivir-space-2)] text-sm [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] leading-tight transition-[color,box-shadow,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50',
        active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground',
        ghostActive && '[font-weight:600]',

        // token-lint-disable-next-line no-literal-length
        segmented && 'inline-flex items-center justify-center min-h-[32px]'
    )}
    onclick={() => {
        if (!disabled) tabsState.value = value;
    }}
    {...rest}
>
    {@render children?.()}
</button>
