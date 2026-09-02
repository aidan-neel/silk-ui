<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import { getSelectContext } from './context.svelte';
    import SelectValue from './select-value.svelte';

    const { state } = getSelectContext();
    const { id: popoverId, state: popoverState } = getPopoverContext();

    type Props = {
        children?: Snippet;
        class?: string;
        variant?: ButtonVariant;
    } & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;

    let { children, class: className, variant = 'outline', ...rest }: Props = $props();
</script>

<Popover.Trigger
    class={cn(
        className,
        'flex flex-row items-center justify-between focus-visible:shadow-[var(--focus-ring)]'
    )}
    role="combobox"
    aria-haspopup="listbox"
    aria-controls={`popover-${popoverId}-content`}
    aria-expanded={popoverState.open}
    aria-label={state.value !== ''
        ? `Selected value ${state.selectedLabel || state.value}`
        : ((rest as { 'aria-label'?: string })['aria-label'] ?? 'Open select')}
    {variant}
    {...rest}
>
    <!--
	  Always render children so icons/avatars stay mounted.
	  Use <Select.Value /> inside for the label that updates on select.
	-->
    <div
        class={cn(
            'flex min-w-0 flex-1 items-center gap-2 overflow-hidden pr-2 text-left [&_svg]:shrink-0',
            state.value !== '' ? 'text-foreground' : 'text-foreground-muted'
        )}
    >
        {#if children}
            {@render children()}
        {:else}
            <SelectValue />
        {/if}
    </div>
    <ChevronDown aria-hidden="true" class="shrink-0 text-foreground-muted" />
</Popover.Trigger>
