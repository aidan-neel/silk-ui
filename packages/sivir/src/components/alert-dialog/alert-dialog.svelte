<script lang="ts">
	import * as Modal from '@sivir/ui/components/modal';
	import type { AlertDialogProps } from '.';

	let { open = $bindable(false), error = false, children }: AlertDialogProps = $props();
</script>

<Modal.Root bind:open {error}>
	{@render children?.()}
</Modal.Root>
