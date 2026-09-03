<script lang="ts">
    import { untrack } from 'svelte';
    import type { ModalFooterProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalFooterProps = $props();
    const modal = getModalContext();

    modal.footerSlot = untrack(() => ({
        children,
        className,
        rest
    }));
</script>
