<script lang="ts">
	import { Button } from '@sivir-ui/svelte/components/button';
	import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root class="w-full max-w-[28rem]">
	<Card.Header>
		<Card.Title>Settings</Card.Title>
	</Card.Header>
	<Card.Footer>
		<Button variant="outline" size="sm">Cancel</Button>
		<Button size="sm">Apply</Button>
	</Card.Footer>
</Card.Root>
