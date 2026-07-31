<script lang="ts">
	import * as Combobox from '@sivir-ui/svelte/components/combobox';

	let {
		onApple = () => {},
		onBanana = () => {},
		onCherry = () => {}
	}: {
		onApple?: () => void;
		onBanana?: () => void;
		onCherry?: () => void;
	} = $props();
</script>

<Combobox.Root placeholder="Search fruits">
	<Combobox.Trigger data-testid="combobox-trigger" />
	<Combobox.Content>
		<Combobox.Results>
			<Combobox.Item value="apple" label="Apple" callback={onApple} />
			<Combobox.Item value="banana" label="Banana" callback={onBanana} />
			<Combobox.Item value="cherry" label="Cherry" callback={onCherry} />
		</Combobox.Results>
	</Combobox.Content>
</Combobox.Root>
