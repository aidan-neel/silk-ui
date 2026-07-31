<script lang="ts">
	import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
	import type { PromptComposerStatus } from '@sivir-ui/svelte/components/prompt-composer';

	const variants: Array<{ label: string; status: PromptComposerStatus; value: string }> = [
		{ label: 'Idle', status: 'idle', value: 'Compare the two implementation options.' },
		{ label: 'Submitting', status: 'submitting', value: 'Checking the deployment plan...' },
		{ label: 'Error', status: 'error', value: 'Summarize the incident timeline.' }
	];
</script>

<div class="grid w-full max-w-2xl gap-5">
	{#each variants as variant (variant.status)}
		<div class="flex flex-col gap-2">
			<span class="px-1 text-xs font-medium text-foreground-muted">{variant.label}</span>
			<PromptComposer.Root
				value={variant.value}
				status={variant.status}
				onSubmit={() => {}}
				onStop={() => {}}
			>
				<PromptComposer.Input aria-label={`${variant.label} prompt`} />
				<PromptComposer.Toolbar>
					<PromptComposer.Actions>
						<span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
					</PromptComposer.Actions>
					<PromptComposer.Submit />
				</PromptComposer.Toolbar>
			</PromptComposer.Root>
		</div>
	{/each}
</div>
