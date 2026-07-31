<script lang="ts">
	import * as Message from '@sivir-ui/svelte/components/message';
</script>

<div class="w-full max-w-2xl space-y-7">
	<Message.Root from="assistant">
		<Message.Content>
			The deployment is healthy. Error rate and p95 latency are both below the rollback threshold.
		</Message.Content>
	</Message.Root>

	<Message.Root from="user">
		<Message.Content>Keep monitoring until the 30-minute mark.</Message.Content>
	</Message.Root>

	<Message.Root from="system">
		<Message.Content>
			Context compacted after 18 messages. Deployment events and decisions were preserved.
		</Message.Content>
	</Message.Root>
</div>
