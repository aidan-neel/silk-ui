<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import type { ButtonProps } from '@sivir-ui/svelte/components/button';

    let { class: className, children, onclick, ...rest }: ButtonProps = $props();
</script>

<Modal.Trigger {onclick} class={className} {...rest}>
    {@render children?.()}
</Modal.Trigger>
