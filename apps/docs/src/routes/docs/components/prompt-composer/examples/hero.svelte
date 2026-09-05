<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import ShieldCheck from '@lucide/svelte/icons/shield-check';
    import Square from '@lucide/svelte/icons/square';
    import Workflow from '@lucide/svelte/icons/workflow';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
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
    <PromptComposer.Root bind:value onSubmit={submitPrompt} onStop={stopSubmission}>
        <PromptComposer.Input
            aria-label="Prompt"
            placeholder="Ask the agent..."
            class="!min-h-20"
        />

        <PromptComposer.Toolbar class="!min-h-10 !items-center !gap-2 !px-2 !py-1.5">
            <PromptComposer.Actions class="!flex-none !gap-1">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        variant="ghost"
                        size="md"
                        class="!w-24 !gap-1.5 !rounded-lg"
                    >
                        <Workflow size={14} aria-hidden="true" />
                        {mode}
                        <ChevronDown
                            size={12}
                            class="ml-auto text-foreground-muted"
                            aria-hidden="true"
                        />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Mode</DropdownMenu.Label>
                        {#each modes as option (option)}
                            <DropdownMenu.Item callback={() => (mode = option)}>
                                <span class="flex-1">{option}</span>
                                {#if mode === option}
                                    <Check size={13} aria-hidden="true" />
                                {/if}
                            </DropdownMenu.Item>
                        {/each}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        variant="ghost"
                        size="md"
                        class="!w-36 !gap-1.5 !rounded-lg"
                    >
                        <ShieldCheck size={14} aria-hidden="true" />
                        {permission}
                        <ChevronDown
                            size={12}
                            class="ml-auto text-foreground-muted"
                            aria-hidden="true"
                        />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Permission</DropdownMenu.Label>
                        {#each permissions as option (option)}
                            <DropdownMenu.Item callback={() => (permission = option)}>
                                <span class="flex-1">{option}</span>
                                {#if permission === option}
                                    <Check size={13} aria-hidden="true" />
                                {/if}
                            </DropdownMenu.Item>
                        {/each}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </PromptComposer.Actions>

            <div class="ml-auto flex min-w-0 items-center gap-1">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        variant="ghost"
                        size="md"
                        class="!max-w-52 !gap-1.5 !rounded-lg"
                    >
                        <span class="truncate">{model}</span>
                        <span class="text-foreground-muted">{effort}</span>
                        <ChevronDown
                            size={12}
                            class="ml-auto shrink-0 text-foreground-muted"
                            aria-hidden="true"
                        />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Configuration</DropdownMenu.Label>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>Model</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent>
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
                            <DropdownMenu.SubContent>
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

                <PromptComposer.Submit label="Send" class="!aspect-auto !gap-1.5 !rounded-lg !px-3">
                    {#snippet children({ action })}
                        {#if action === 'stop'}
                            <Square size={8} fill="currentColor" aria-hidden="true" />
                            Stop
                        {:else}
                            Send
                            <Shortcut shortcut="enter" />
                        {/if}
                    {/snippet}
                </PromptComposer.Submit>
            </div>
        </PromptComposer.Toolbar>
    </PromptComposer.Root>
</div>
