<script lang="ts">
	import { Toggle } from '@sivir-ui/svelte/components/toggle';
	import Bold from '@lucide/svelte/icons/bold';
</script>

<div class="flex gap-2">
	<Toggle size="sm">
		<Bold size={12} />
	</Toggle>
	<Toggle>
		<Bold size={14} />
	</Toggle>
	<Toggle size="lg">
		<Bold size={16} />
	</Toggle>
</div>
