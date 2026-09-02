<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import type { DefaultProps } from '@sivir-ui/svelte/utils';

    let { class: className, children, ...rest }: DefaultProps = $props();
</script>

<Modal.Footer class={className} {...rest}> {@render children?.()} </Modal.Footer>
