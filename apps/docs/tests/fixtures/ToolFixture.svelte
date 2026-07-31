<script lang="ts">
	import * as Tool from '@sivir-ui/svelte/components/tool';

	let { state = 'running' }: { state?: Tool.ToolState } = $props();
</script>

<Tool.Root name="Checking deployment" {state} duration="6s">
	<Tool.Item name="Bash" detail="vercel inspect" />
</Tool.Root>
