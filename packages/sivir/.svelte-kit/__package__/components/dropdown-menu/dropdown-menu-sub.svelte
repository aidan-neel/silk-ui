<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { type Snippet } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import { getDropdownMenuContext, setDropdownMenuContext } from './context.svelte';

    const { state: parentState } = getPopoverContext();
    const parentMenu = getDropdownMenuContext();
    /** Extend the cone: ancestors are the path from root through this sub's parent. */
    setDropdownMenuContext({
        inverted: parentMenu.inverted,
        ancestors: [...parentMenu.ancestors, parentState],
        submenus: [],
        parentSubmenus: parentMenu.submenus
    });

    type Props = {
        children?: Snippet;
    };

    let { children }: Props = $props();
</script>

<Popover.Root hoverable={true} closeDelay={300} placement="right">
    {@render children?.()}
</Popover.Root>
