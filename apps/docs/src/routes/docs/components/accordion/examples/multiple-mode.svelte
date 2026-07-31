<script lang="ts">
	import * as Accordion from '@sivir-ui/svelte/components/accordion';
</script>

<div class="w-full max-w-md">
	<Accordion.Root type="multiple">
		<Accordion.Item value="a">
			<Accordion.Trigger>Item A</Accordion.Trigger>
			<Accordion.Content>Content A. Any panels can be open together.</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="b">
			<Accordion.Trigger>Item B</Accordion.Trigger>
			<Accordion.Content>Content B. Opening this keeps Item A open too.</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
