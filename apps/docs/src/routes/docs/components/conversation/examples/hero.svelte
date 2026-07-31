<script lang="ts">
	import * as Conversation from '@sivir-ui/svelte/components/conversation';
	import { Markdown } from '@sivir-ui/svelte/components/markdown';
	import * as Message from '@sivir-ui/svelte/components/message';
	import * as Reasoning from '@sivir-ui/svelte/components/reasoning';

	const finding = [
		'### What changed',
		'',
		'The latency increase starts in `POST /checkout` immediately after release `web-2418`.',
		'',
		'- Address validation added **430 ms** at p95.',
		'- The provider timed out for 8% of non-US requests.',
		'- Database and inventory spans stayed within baseline.',
		'',
		'> Roll back the synchronous validation call, then keep the rule behind the existing review queue.'
	].join('\n');

	const rollback = [
		'Use the targeted flag first:',
		'',
		'```ts',
		"await flags.disable('checkout.address-verification');",
		'await metrics.waitForRecovery({ window: "10m" });',
		'```',
		'',
		'This avoids reverting the unrelated tax fixes in the same release.'
	].join('\n');
</script>

<Conversation.Root
	class="h-[30rem] w-full max-w-3xl rounded-[var(--radius-xl)] border border-border bg-panel"
>
	<Conversation.Content aria-label="Checkout incident conversation">
		<Message.Root from="user">
			<Message.Content>
				Investigate why checkout latency rose after 14:00 UTC. Focus on the latest release and give
				me a safe mitigation.
			</Message.Content>
		</Message.Root>

		<Message.Root from="assistant">
			<Message.Content class="space-y-4">
				<Reasoning.Root open>
					<Reasoning.Trigger title="Compared traces with the release timeline" duration="4.8s" />
					<Reasoning.Content>
						<p>
							Separated provider, database, and inventory spans, then matched the first regression
							to the release boundary.
						</p>
					</Reasoning.Content>
				</Reasoning.Root>
				<Markdown content={finding} />
			</Message.Content>
		</Message.Root>

		<Message.Root from="user">
			<Message.Content>Show me the smallest rollback and how to verify it.</Message.Content>
		</Message.Root>

		<Message.Root from="assistant">
			<Message.Content><Markdown content={rollback} /></Message.Content>
		</Message.Root>
	</Conversation.Content>
	<Conversation.ScrollButton />
</Conversation.Root>
