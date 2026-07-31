<script lang="ts">
	import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
</script>

<Reasoning.Root class="w-full max-w-xl">
	<Reasoning.Trigger title="Investigated checkout failures" duration="4.8s" />
	<Reasoning.Content>
		<div class="space-y-3">
			<p>Compared the incident timeline with the last five production deployments.</p>
			<p>
				Filtered payment errors by issuer country and found the regression only affects non-US
				cards.
			</p>
			<p>
				Matched the first failing request to the new address-verification rule shipped by the
				provider.
			</p>
		</div>
	</Reasoning.Content>
</Reasoning.Root>
