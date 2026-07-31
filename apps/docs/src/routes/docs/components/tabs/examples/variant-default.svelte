<script lang="ts">
	import * as Tabs from '@sivir-ui/svelte/components/tabs';

	let tab = $state('overview');
</script>

<Tabs.Root bind:value={tab}>
	<Tabs.List>
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
		<Tabs.Trigger value="files">Files</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
