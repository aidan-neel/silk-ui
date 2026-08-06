<script lang="ts">
    import { ChevronDown } from '@lucide/svelte';
    import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import { getSelectContext } from './context.svelte';

    const { state, labels } = getSelectContext();
    const { id: popoverId, state: popoverState } = getPopoverContext();

    type Props = {
        children?: Snippet;
        class?: string;
        variant?: ButtonVariant;
    } & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;

    let { children, class: className, variant = 'outline', ...rest }: Props = $props();

    const selectedLabel = $derived(
        state.value !== '' ? state.selectedLabel || labels.get(state.value) || '' : ''
    );
</script>

<Popover.Trigger
    class={cn(
        className,
        `flex flex-row items-center justify-between focus-visible:shadow-[var(--focus-ring)] ${state.value !== '' ? 'text-foreground' : 'text-foreground-muted'}`
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
        class="flex min-w-0 flex-1 items-center gap-2 overflow-hidden pr-2 text-left [&_svg]:shrink-0"
    >
        {#if children}
            {@render children()}
        {:else if selectedLabel}
            <span class="truncate">{selectedLabel}</span>
        {/if}
    </div>
    <ChevronDown aria-hidden="true" class="shrink-0" />
</Popover.Trigger>
