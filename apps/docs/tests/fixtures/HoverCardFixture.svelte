<script lang="ts">
	import * as HoverCard from '@sivir-ui/svelte/components/hover-card';

	let {
		openDelay = 200,
		closeDelay = 150,
		triggerHref = undefined as string | undefined
	} = $props();
</script>

<HoverCard.Root {openDelay} {closeDelay}>
	<HoverCard.Trigger href={triggerHref}>
		<span data-testid="hovercard-trigger">@username</span>
	</HoverCard.Trigger>
	<HoverCard.Content>
		<HoverCard.Title>
			<span data-testid="hovercard-title">User profile</span>
		</HoverCard.Title>
		<HoverCard.Description>
			<span data-testid="hovercard-description">Some descriptive content.</span>
		</HoverCard.Description>
	</HoverCard.Content>
</HoverCard.Root>
