<script lang="ts">
	import { Button } from '@sivir-ui/svelte/components/button';
	import { toast } from '@sivir-ui/svelte/components/toast';
</script>

<div class="flex flex-wrap gap-2">
	<Button
		onclick={() => toast({ title: 'Heads up', description: 'A neutral toast.', type: 'default' })}
		>Default</Button
	>
	<Button
		onclick={() =>
			toast.success('Profile updated', { description: 'Your changes have been saved.' })}
		>Success</Button
	>
	<Button
		onclick={() =>
			toast.error('Request failed', { description: 'Could not connect to the server.' })}
		>Error</Button
	>
	<Button
		onclick={() =>
			toast.warning('Storage almost full', { description: 'You have 200 MB remaining.' })}
		>Warning</Button
	>
	<Button onclick={() => toast.info('New version', { description: 'Refresh to update.' })}
		>Info</Button
	>
</div>
