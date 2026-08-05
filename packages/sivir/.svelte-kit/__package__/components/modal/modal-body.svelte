<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { ModalBodyProps } from '.';

let { class: className, children, ...rest }: ModalBodyProps = $props();
</script>

<div {...rest} data-ui="modal-body" class={cn(className, 'flex flex-col')}>
    {@render children?.()}
</div>
