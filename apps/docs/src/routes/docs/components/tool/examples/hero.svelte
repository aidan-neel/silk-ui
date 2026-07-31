<script lang="ts">
	import * as Tool from '@sivir-ui/svelte/components/tool';
</script>

<Tool.Root name="1 file, 1 search, and 1 command" state="complete" duration="6s">
	<Tool.Item name="Bash" detail="pnpm lint" />
	<Tool.Item name="Grep" detail="InputBar" kind="search" />
	<Tool.Item name="Read" detail="/lib/agent-ui/components/input-bar.tsx" kind="read" />
</Tool.Root>
