<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';

    let { class: className, children, ...rest }: DefaultProps = $props();
</script>

<Modal.Footer class={cn(className, 'mt-1')} {...rest}>
    {@render children?.()}
</Modal.Footer>
