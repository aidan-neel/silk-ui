<script lang="ts">
    import type { ButtonProps } from '@sivir-ui/svelte/components/button';
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let { class: className, children, onclick, ...rest }: ButtonProps = $props();
</script>

<Modal.Trigger {onclick} class={className} {...rest}> {@render children?.()} </Modal.Trigger>
