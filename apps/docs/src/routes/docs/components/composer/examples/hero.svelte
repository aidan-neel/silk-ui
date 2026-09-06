<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import ShieldCheck from '@lucide/svelte/icons/shield-check';
    import Workflow from '@lucide/svelte/icons/workflow';
    import * as Composer from '@sivir-ui/svelte/components/composer';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import * as Select from '@sivir-ui/svelte/components/select';
    import { onDestroy } from 'svelte';

    const models = ['Sivir 3.1', 'Sivir Mini'];
    const modes = ['Plan', 'Build'];
    const permissions = ['Ask first', 'Auto approve'];
    const efforts = ['Low', 'Medium', 'High'];

    let value = $state('Review the release notes and call out any migration risks.');
    let model = $state(models[0]);
    let mode = $state(modes[0]);
    let permission = $state(permissions[0]);
    let effort = $state(efforts[2]);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settle: (() => void) | undefined;

    async function submitPrompt() {
        await new Promise<void>((resolve) => {
            settle = resolve;
            timer = setTimeout(() => {
                value = '';
                timer = undefined;
                settle = undefined;
                resolve();
            }, 1600);
        });
    }

    function stopSubmission() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = undefined;
        const resolve = settle;
        settle = undefined;
        resolve?.();
    }

    onDestroy(() => {
        if (timer) {
            clearTimeout(timer);
        }
        settle?.();
    });
</script>

<div class="flex w-full max-w-2xl flex-col">
    <Composer.Root bind:value onSubmit={submitPrompt} onStop={stopSubmission}>
        <Composer.Input aria-label="Prompt" placeholder="Ask the agent..." />

        <Composer.Toolbar>
            <Composer.Actions>
                <Select.Root bind:value={mode}>
                    <Select.Trigger variant="ghost" class="w-32">
                        <Workflow size={14} aria-hidden="true" />
                        <span class="truncate">{mode}</span>
                    </Select.Trigger>
                    <Select.Content dynamic>
                        <Select.Label>Mode</Select.Label>
                        {#each modes as option (option)}
                            <Select.Item value={option}>{option}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>

                <Select.Root bind:value={permission}>
                    <Select.Trigger variant="ghost" class="w-44">
                        <ShieldCheck size={14} aria-hidden="true" />
                        <span class="truncate">{permission}</span>
                    </Select.Trigger>
                    <Select.Content dynamic>
                        <Select.Label>Permission</Select.Label>
                        {#each permissions as option (option)}
                            <Select.Item value={option}>{option}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </Composer.Actions>

            <div class="ml-auto flex min-w-0 items-center gap-1">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger variant="ghost" class="w-52">
                        <span class="flex min-w-0 flex-1 items-center gap-1.5">
                            <span class="truncate">{model}</span>
                            <span class="text-foreground-muted">{effort}</span>
                        </span>
                        <ChevronDown
                            size={12}
                            class="ml-auto shrink-0 text-foreground-muted"
                            aria-hidden="true"
                        />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content dynamic>
                        <DropdownMenu.Label>Configuration</DropdownMenu.Label>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>Model</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent dynamic>
                                {#each models as option (option)}
                                    <DropdownMenu.Item callback={() => (model = option)}>
                                        <span class="flex-1">{option}</span>
                                        {#if model === option}
                                            <Check size={13} aria-hidden="true" />
                                        {/if}
                                    </DropdownMenu.Item>
                                {/each}
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>Effort</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent dynamic>
                                {#each efforts as option (option)}
                                    <DropdownMenu.Item callback={() => (effort = option)}>
                                        <span class="flex-1">{option}</span>
                                        {#if effort === option}
                                            <Check size={13} aria-hidden="true" />
                                        {/if}
                                    </DropdownMenu.Item>
                                {/each}
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <Composer.Submit />
            </div>
        </Composer.Toolbar>
    </Composer.Root>
</div>
