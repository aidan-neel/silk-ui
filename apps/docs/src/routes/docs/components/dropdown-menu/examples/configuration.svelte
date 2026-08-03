<script lang="ts">
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import Check from '@lucide/svelte/icons/check';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    let model = $state('GPT-5.6 Sol');
    let effort = $state('High');
    let speed = $state('Standard');
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger variant="outline" class="min-w-[11rem] justify-between">
        <span>Configuration</span>
        <ChevronDown size={15} class="text-foreground-muted" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="min-w-[11rem]">
        <DropdownMenu.Label>Configuration</DropdownMenu.Label>
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Model</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent class="min-w-[12rem]">
                <DropdownMenu.Item callback={() => (model = 'GPT-5.6 Sol')}>
                    <span>GPT-5.6 Sol</span>
                    {#if model === 'GPT-5.6 Sol'}<Check size={16} class="ml-auto" />{/if}
                </DropdownMenu.Item>
                <DropdownMenu.Item callback={() => (model = 'Opus 4.6')}>
                    <span>Opus 4.6</span>
                    {#if model === 'Opus 4.6'}<Check size={16} class="ml-auto" />{/if}
                </DropdownMenu.Item>
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Effort</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent class="min-w-[10rem]">
                {#each ['Low', 'Medium', 'High'] as option (option)}
                    <DropdownMenu.Item callback={() => (effort = option)}>
                        <span>{option}</span>
                        {#if effort === option}<Check size={16} class="ml-auto" />{/if}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Speed</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent class="min-w-[10rem]">
                {#each ['Fast', 'Standard', 'Deliberate'] as option (option)}
                    <DropdownMenu.Item callback={() => (speed = option)}>
                        <span>{option}</span>
                        {#if speed === option}<Check size={16} class="ml-auto" />{/if}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
    </DropdownMenu.Content>
</DropdownMenu.Root>
