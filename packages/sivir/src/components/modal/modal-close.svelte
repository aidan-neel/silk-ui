<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import type { ModalCloseProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, onclick, ...rest }: ModalCloseProps = $props();

    const modal = getModalContext();
    let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);

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
    variant="ghost"
    {...rest}
    class={cn(className, 'mr-auto flex flex-row items-center justify-center gap-2')}
>
    {@render children?.()}
</Button>
