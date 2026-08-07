<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import type { Snippet } from 'svelte';
    import { untrack } from 'svelte';
    import { setDropdownMenuContext } from './context.svelte';

    type Props = {
        children: Snippet;
        inverted?: boolean;
    };

    let { children, inverted = false }: Props = $props();

    /**
     * Must run during init: Content reads this via `getContext()` while it
     * initializes, which happens before any `$effect` fires.
     */
    setDropdownMenuContext({ inverted: untrack(() => inverted), ancestors: [], submenus: [] });
</script>

<Popover.Root placement="bottom-start"> {@render children?.()} </Popover.Root>
