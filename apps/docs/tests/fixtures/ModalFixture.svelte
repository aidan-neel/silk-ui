<script lang="ts">
	import * as Modal from '@sivir-ui/svelte/components/modal';

	let {
		open = $bindable(false),
		allowClickOutside = true,
		error = false,
		role = 'dialog' as 'dialog' | 'alertdialog'
	} = $props();
</script>

<button data-testid="trigger" onclick={() => (open = true)}>Open</button>

<Modal.Root bind:open {error}>
	<Modal.Content {allowClickOutside} {role}>
		<Modal.Title>Modal Title</Modal.Title>
		<Modal.Description>Modal Description</Modal.Description>
		<Modal.Body>
			<button data-testid="inside-1">Inside one</button>
			<button data-testid="inside-2">Inside two</button>
		</Modal.Body>
		<Modal.Close onclick={() => (open = false)}>Close</Modal.Close>
		<Modal.Confirm onclick={() => (open = false)}>Confirm</Modal.Confirm>
	</Modal.Content>
</Modal.Root>
