<script lang="ts">
    import { Button, type ButtonProps } from '@sivir-ui/svelte/components/button';
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
    variant="ghost"
    {...rest}
    class={cn(className, 'mr-auto flex flex-row items-center justify-center gap-2')}
>
    {@render children?.()}
</Button>
