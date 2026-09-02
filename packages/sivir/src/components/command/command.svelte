<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { untrack } from 'svelte';
    import type { CommandProps, CommandState } from '.';
    import { resetCommand, setCommandContext } from './context.svelte';

    let { open = $bindable(false), onOpenChange, children }: CommandProps = $props();
    const id = $props.id();

    const command = $state<CommandState>({
        id,
        items: [],
        results: [],
        searchContent: '',
        activeId: undefined,
        itemsVersion: 0
    });
    setCommandContext(command);

    $effect(() => {
        if (open) {
            untrack(() => resetCommand(command));
        }
    });
</script>

<Modal.Root bind:open {onOpenChange}> {@render children?.()} </Modal.Root>
