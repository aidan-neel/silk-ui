<script lang="ts">
	import { Toaster } from '@sivir-ui/svelte/components/toast';

	let { showNested = true }: { showNested?: boolean } = $props();
</script>

<Toaster />
{#if showNested}
	<Toaster />
{/if}
