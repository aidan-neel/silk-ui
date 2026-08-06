<script lang="ts">
    import { Button, type ButtonProps } from '@sivir-ui/svelte/components/button';
    import { closeMenuLayers, cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import { getDropdownMenuContext } from './context.svelte';

    const { state: popoverState } = getPopoverContext();
    const { ancestors } = getDropdownMenuContext();

    type Props = {
        children?: Snippet;
        callback?: () => void;
    } & ButtonProps;

    let {
        children,
        class: className,
        callback,
        onclick: userOnclick,
        element = $bindable(),
        ...rest
    }: Props = $props();
</script>

<Button
    bind:element
    role="menuitem"
    data-collection-item
    {...rest}
    onclick={(event: MouseEvent) => {
        closeMenuLayers(popoverState, ancestors);
        callback?.();
        userOnclick?.(event);
    }}
    class={cn(className, 'sivir-menu-item flex-row gap-3 text-sm')}
    unstyled
>
    {@render children?.()}
</Button>
