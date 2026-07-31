<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
</script>

<Popover.Root>
	<Popover.Trigger>Open menu</Popover.Trigger>
	<Popover.Content class="w-64">
		<div class="p-3">
			<p class="m-0 text-sm text-foreground-muted">Popover content goes here.</p>
		</div>
	</Popover.Content>
</Popover.Root>
