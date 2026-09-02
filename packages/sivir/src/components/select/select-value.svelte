<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getSelectContext } from './context.svelte';

    let {
        placeholder = 'Select',
        class: className
    }: {
        placeholder?: string;
        class?: string;
    } = $props();

    const { state, labels } = getSelectContext();

    const hasValue = $derived(state.value !== '');
    const label = $derived(hasValue ? state.selectedLabel || labels.get(state.value) || '' : '');
    /**
     * Never show the placeholder while a value is selected -- doing so made the
     * trigger flash the placeholder again the moment the menu opened and labels
     * resolved.
     */
    const text = $derived(hasValue ? label : placeholder);
</script>

<span
    data-ui="select-value"
    data-placeholder={hasValue ? undefined : ''}
    class={cn(
        className,
        'min-w-0 truncate',
        hasValue ? 'text-foreground' : 'text-foreground-muted'
    )}
>
    {text}
</span>
