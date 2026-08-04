<script lang="ts">
import * as Combobox from '@sivir-ui/svelte/components/combobox';

let {
    onApple = () => {},
    onBanana = () => {},
    onCherry = () => {},
    searchPlacement = 'trigger'
}: {
    onApple?: () => void;
    onBanana?: () => void;
    onCherry?: () => void;
    searchPlacement?: 'trigger' | 'menu';
} = $props();
</script>

<Combobox.Root>
    <Combobox.Trigger
        {searchPlacement}
        placeholder="Search fruits"
        data-testid="combobox-trigger"
    />
    <Combobox.Content>
        <Combobox.Results>
            <Combobox.Item value="apple" label="Apple" callback={onApple} />
            <Combobox.Item value="banana" label="Banana" callback={onBanana} />
            <Combobox.Item value="cherry" label="Cherry" callback={onCherry} />
        </Combobox.Results>
    </Combobox.Content>
</Combobox.Root>
