<script lang="ts">
    import { Button, type ButtonProps } from '@sivir-ui/svelte/components/button';
    import { useIsDark } from '@sivir-ui/svelte/is-dark.svelte.ts';
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import { getModalContext } from '../modal/context.svelte';

    type Props = {
        closeOnClick?: boolean;
        onclick?: (event: MouseEvent) => void;
    } & DefaultProps &
        ButtonProps;

    let { class: className, children, onclick, closeOnClick = true, ...rest }: Props = $props();

    const modal = getModalContext();
    let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);

    /** Cancel reads as outline in light, ghost in dark. */
    const isDark = useIsDark();
    const cancelVariant = $derived(isDark.current ? 'ghost' : 'outline');
    const actionWidthClass = $derived(
        modal.state.orientation === 'vertical' ? 'w-full sm:flex-1' : 'w-full sm:w-fit'
    );

    function handleClick(event: MouseEvent) {
        if (closeOnClick) {
            modal.state.open = false;
        }
        onclick?.(event);
    }

    onMount(() => {
        element?.focus();
    });
</script>

<Button
    bind:element
    onclick={handleClick}
    variant={cancelVariant}
    {...rest}
    class={cn(className, 'flex flex-row items-center justify-center gap-2', actionWidthClass)}
>
    {@render children?.()}
</Button>
