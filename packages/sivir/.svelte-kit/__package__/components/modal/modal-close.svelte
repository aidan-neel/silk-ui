<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { useIsDark } from '@sivir-ui/svelte/is-dark.svelte.ts';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import type { ModalCloseProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, onclick, ...rest }: ModalCloseProps = $props();

    const modal = getModalContext();
    let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);

    /** Cancel reads as outline in light, ghost in dark. */
    const isDark = useIsDark();
    const cancelVariant = $derived(isDark.current ? 'ghost' : 'outline');
    const actionWidthClass = $derived(
        modal.state.orientation === 'vertical' ? 'w-full sm:flex-1' : 'w-full sm:w-fit'
    );

    onMount(() => {
        element?.focus();
    });
</script>

<Button
    bind:element
    onclick={(event: MouseEvent) => {
        modal.state.open = false;
        onclick?.(event);
    }}
    variant={cancelVariant}
    {...rest}
    class={cn(className, 'flex flex-row items-center justify-center gap-2', actionWidthClass)}
>
    {@render children?.()}
</Button>
