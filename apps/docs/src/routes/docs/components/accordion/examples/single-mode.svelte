<script lang="ts">
	import * as Accordion from '@sivir/ui/components/accordion';
</script>

<div class="w-full max-w-md">
	<Accordion.Root type="single">
		<Accordion.Item value="a">
			<Accordion.Trigger>Item A</Accordion.Trigger>
			<Accordion.Content>Content A. Only one panel is open at a time.</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="b">
			<Accordion.Trigger>Item B</Accordion.Trigger>
			<Accordion.Content>Content B. Opening this closes Item A.</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
