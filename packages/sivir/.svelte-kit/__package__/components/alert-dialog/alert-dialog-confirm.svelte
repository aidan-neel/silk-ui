<script lang="ts">
    import { Button, type ButtonProps } from '@sivir-ui/svelte/components/button';
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';
    import { getModalContext } from '../modal/context.svelte';

    type Props = {
        closeOnClick?: boolean;
        onclick?: (event: MouseEvent) => void;
    } & DefaultProps &
        ButtonProps;

    const modal = getModalContext();
    let {
        class: className,
        children,
        onclick,
        closeOnClick = true,
        variant,
        ...rest
    }: Props = $props();
    const confirmVariant = $derived(variant ?? (modal.state.error ? 'destructive' : 'primary'));

    function handleClick(event: MouseEvent) {
        if (closeOnClick) {
            modal.state.open = false;
        }
        onclick?.(event);
    }
</script>

<Button
    {...rest}
    variant={confirmVariant}
    onclick={handleClick}
    class={cn(className, 'ml-auto flex flex-row items-center justify-center gap-2')}
>
    {@render children?.()}
</Button>
