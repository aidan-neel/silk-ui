<script lang="ts">
import * as Modal from '@sivir-ui/svelte/components/modal';
import { type DefaultProps } from '@sivir-ui/svelte/utils';

let { class: className, children, ...rest }: DefaultProps = $props();
</script>

<Modal.Header {...rest} class={className}>
    {@render children?.()}
</Modal.Header>
