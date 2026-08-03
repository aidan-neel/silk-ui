<script lang="ts">
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import Star from '@lucide/svelte/icons/star';
    import Check from '@lucide/svelte/icons/check';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    const options = ['Most starred', 'Recently updated', 'Alphabetical', 'Oldest first'];
    let selected = $state(options[0]);
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger variant="ghost" class="h-9 gap-1.5 text-[0.82rem]">
        <Star size={13} />
        {selected}
        <ChevronDown size={11} class="text-foreground-muted" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="min-w-[12rem]">
        {#each options as option (option)}
            <DropdownMenu.Item callback={() => (selected = option)}>
                <span>{option}</span>
                {#if selected === option}<Check size={12} class="ml-auto text-primary" />{/if}
            </DropdownMenu.Item>
        {/each}
    </DropdownMenu.Content>
</DropdownMenu.Root>
