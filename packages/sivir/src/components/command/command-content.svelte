<!-- token-lint-disable-file -->
<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';

    type Props = {
        children?: Snippet;
        class?: string;
        allowClickOutside?: boolean;
        label?: string;
    };

    const {
        children,
        class: className,
        allowClickOutside = true,
        label = 'Command palette',
        ...rest
    }: Props = $props();
</script>

<Modal.Content
    {allowClickOutside}
    size="xl"
    showClose={false}
    panelIdPrefix="command"
    data-ui="command-content"
    aria-label={label}
    aria-labelledby={undefined}
    aria-describedby={undefined}
    class={cn(
        className,
        'fixed top-[var(--sivir-viewport-center)] flex max-h-[min(28rem,calc(var(--sivir-viewport-height)-2rem))] min-h-20 w-[calc(100%-2rem)] max-w-[32.5rem] flex-col overflow-hidden rounded-[var(--radius-xl)]' // token-lint-disable-line no-literal-length
    )}
    surfaceClass="min-h-0 flex-1 gap-0 overflow-hidden p-0"
    {...rest}
>
    {@render children?.()}
</Modal.Content>
