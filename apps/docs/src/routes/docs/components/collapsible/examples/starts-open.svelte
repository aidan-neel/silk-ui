<script lang="ts">
	import * as Collapsible from '@sivir-ui/svelte/components/collapsible';
</script>

<div class="w-full max-w-md">
	<Collapsible.Root open>
		<Collapsible.Trigger>Close panel</Collapsible.Trigger>
		<Collapsible.Content>This panel starts open.</Collapsible.Content>
	</Collapsible.Root>
</div>
