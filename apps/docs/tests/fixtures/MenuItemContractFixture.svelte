<script lang="ts">
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';

    let { overrideClass = '' }: { overrideClass?: string } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <span data-testid="contract-trigger">Open menu</span>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Item>
            <span data-testid="plain-item">Plain</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item class={overrideClass}>
            <span data-testid="override-item">Overridden</span>
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
