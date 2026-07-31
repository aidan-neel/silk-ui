<script lang="ts">
	import { Switch } from '@sivir-ui/svelte/components/switch';

	let enabled = $state(true);
</script>

<Switch bind:switched={enabled} label="Push notifications" />
