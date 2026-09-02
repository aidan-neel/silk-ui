<script lang="ts">
    import type { ModalFooterProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalFooterProps = $props();
    const modal = getModalContext();

    modal.footerSlot = {
        children,
        className,
        rest
    };
</script>
