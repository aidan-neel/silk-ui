<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import ShieldCheck from '@lucide/svelte/icons/shield-check';
    import Workflow from '@lucide/svelte/icons/workflow';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import { onDestroy } from 'svelte';

    const models = ['Sivir 3.1', 'Sivir Mini'];
    const modes = ['Plan', 'Build'];
    const permissions = ['Ask first', 'Auto approve'];

    let value = $state('Review the release notes and call out any migration risks.');
    let model = $state(models[0]);
    let mode = $state(modes[0]);
    let permission = $state(permissions[0]);
    let message = $state('Ready to send');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settle: (() => void) | undefined;

    async function submitPrompt(prompt: string) {
        message = 'Sending prompt';
        await new Promise<void>((resolve) => {
            settle = resolve;
            timer = setTimeout(() => {
                value = '';
                message = `Sent “${prompt}”`;
                timer = undefined;
                settle = undefined;
                resolve();
            }, 1600);
        });
    }

    function stopSubmission() {
        if (timer) clearTimeout(timer);
        timer = undefined;
        const resolve = settle;
        settle = undefined;
        message = 'Stopped before sending';
        resolve?.();
    }

    onDestroy(() => {
        if (timer) clearTimeout(timer);
        settle?.();
    });
</script>

<div class="flex w-full max-w-2xl flex-col gap-3">
    <PromptComposer.Root bind:value onSubmit={submitPrompt} onStop={stopSubmission}>
        <PromptComposer.Input aria-label="Prompt" placeholder="Ask the agent..." />

        <PromptComposer.Toolbar class="!min-h-10 !items-center !gap-2 !px-2 !py-1.5">
            <PromptComposer.Actions class="!flex-none !gap-1">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        variant="ghost"
                        size="sm"
                        class="!h-8 !gap-1.5 !rounded-lg !px-2 text-xs"
                    >
                        <Workflow size={14} aria-hidden="true" />
                        {mode}
                        <ChevronDown size={12} class="text-foreground-muted" aria-hidden="true" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Mode</DropdownMenu.Label>
                        {#each modes as option (option)}
                            <DropdownMenu.Item onclick={() => (mode = option)}>
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
                        size="sm"
                        class="!h-8 !gap-1.5 !rounded-lg !px-2 text-xs"
                    >
                        <ShieldCheck size={14} aria-hidden="true" />
                        {permission}
                        <ChevronDown size={12} class="text-foreground-muted" aria-hidden="true" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Permission</DropdownMenu.Label>
                        {#each permissions as option (option)}
                            <DropdownMenu.Item onclick={() => (permission = option)}>
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
                        size="sm"
                        class="!h-8 !max-w-52 !gap-1.5 !rounded-lg !px-2 text-xs"
                    >
                        <span class="truncate">{model}</span>
                        <span class="text-foreground-muted">High</span>
                        <ChevronDown
                            size={12}
                            class="shrink-0 text-foreground-muted"
                            aria-hidden="true"
                        />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="!w-48 !min-w-48">
                        <DropdownMenu.Label>Configuration</DropdownMenu.Label>
                        {#each models as option (option)}
                            <DropdownMenu.Item onclick={() => (model = option)}>
                                <span class="flex-1">{option}</span>
                                {#if model === option}
                                    <Check size={13} aria-hidden="true" />
                                {/if}
                            </DropdownMenu.Item>
                        {/each}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <PromptComposer.Submit label="Send" class="!size-8 !rounded-lg" />
            </div>
        </PromptComposer.Toolbar>
    </PromptComposer.Root>

    <p class="px-1 text-xs text-foreground-muted" role="status" aria-live="polite">
        {message}
    </p>
</div>
