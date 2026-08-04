<script lang="ts">
import { cn, pressable } from '@sivir-ui/svelte/utils';
import type { CollapsibleTriggerProps } from '.';
import { getCollapsibleContext } from './context.svelte';

let { class: className, children, ...rest }: CollapsibleTriggerProps = $props();
const { id, state } = getCollapsibleContext();
</script>

<button
    type="button"
    use:pressable
    data-ui="collapsible-trigger"
    data-state={state.open ? 'open' : 'closed'}
    aria-expanded={state.open}
    aria-controls={`collapsible-${id}`}
    disabled={state.disabled}
    onclick={() => (state.open = !state.open)}
    class={cn(
        className,
        'sivir-press inline-flex items-center gap-2 transition-[transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]'
    )}
    {...rest}
>
    {@render children?.()}
</button>
