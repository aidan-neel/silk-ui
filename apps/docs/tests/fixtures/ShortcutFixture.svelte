<script lang="ts">
    import Button from '@sivir-ui/svelte/components/button';
    import * as Command from '@sivir-ui/svelte/components/command';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let {
        mode = 'button',
        shortcut = 'cmd+k',
        disabled = false,
        onactivate = () => {}
    }: {
        mode?: 'button' | 'standalone' | 'command';
        shortcut?: string;
        disabled?: boolean;
        onactivate?: () => void;
    } = $props();
</script>

{#if mode === 'command'}
    <Command.Root>
        <Command.Trigger data-testid="command-trigger">
            Open command
            <Shortcut {shortcut} data-testid="shortcut" />
        </Command.Trigger>
        <Command.Content>
            <Command.Search placeholder="Search commands" />
            <Command.Results />
        </Command.Content>
    </Command.Root>
{:else if mode === 'standalone'}
    <Shortcut {shortcut} ontrigger={onactivate} data-testid="shortcut" />
{:else}
    <Button onclick={onactivate} {disabled} data-testid="owner">
        Run action
        <Shortcut {shortcut} data-testid="shortcut" />
    </Button>
{/if}

<input data-testid="editable" aria-label="Editable target" />
