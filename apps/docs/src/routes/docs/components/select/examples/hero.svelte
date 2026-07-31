<script lang="ts">
	import * as Select from '@sivir-ui/svelte/components/select';

	const priorities = [
		{ value: 'none', label: 'No priority' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'high', label: 'High' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'low', label: 'Low' }
	];

	let selectedPriority = $state('medium');
	const selected = $derived(priorities.find((p) => p.value === selectedPriority));
</script>

<div class="flex flex-col gap-2">
	<span class="text-sm [font-weight:var(--font-weight-label,500)] text-foreground">Priority</span>
	<Select.Root value={selectedPriority}>
		<Select.Trigger class="min-w-[220px]" variant="outline">
			{selected?.label ?? 'Select priority'}
		</Select.Trigger>
		<Select.Content>
			{#each priorities as priority (priority.value)}
				<Select.Item value={priority.value} onclick={() => (selectedPriority = priority.value)}>
					{priority.label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
