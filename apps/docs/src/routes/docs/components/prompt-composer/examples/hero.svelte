<script lang="ts">
    import * as Attachment from '@sivir-ui/svelte/components/attachment';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import Check from '@lucide/svelte/icons/check';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import LockKeyhole from '@lucide/svelte/icons/lock-keyhole';
    import Sparkles from '@lucide/svelte/icons/sparkles';
    import { onDestroy } from 'svelte';

    const models = ['Sivir 3.1', 'Sivir Mini'];
    const permissions = ['Ask before edits', 'Plan only'];

    let value = $state('Review the release notes and call out any migration risks.');
    let files = $state<File[]>([]);
    let model = $state(models[0]);
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
    <Attachment.Root
        bind:files
        accept=".pdf,.md,.txt"
        maxFiles={3}
        maxSize={5 * 1024 * 1024}
        class="w-full"
    >
        <PromptComposer.Root bind:value onSubmit={submitPrompt} onStop={stopSubmission}>
            <PromptComposer.Input aria-label="Prompt" placeholder="Ask the agent..." />

            <Attachment.List class="px-2 pb-1" />

            <PromptComposer.Toolbar>
                <PromptComposer.Actions>
                    <Attachment.Trigger aria-label="Attach context" />

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                            variant="ghost"
                            size="sm"
                            class="gap-1.5 rounded-lg px-2 text-xs"
                        >
                            <Sparkles size={14} aria-hidden="true" />
                            {model}
                            <ChevronDown
                                size={12}
                                class="text-foreground-muted"
                                aria-hidden="true"
                            />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content class="min-w-44">
                            <DropdownMenu.Label>Model</DropdownMenu.Label>
                            {#each models as option (option)}
                                <DropdownMenu.Item onclick={() => (model = option)}>
                                    <span class="flex-1">{option}</span>
                                    {#if model === option}<Check
                                            size={13}
                                            aria-hidden="true"
                                        />{/if}
                                </DropdownMenu.Item>
                            {/each}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                            variant="ghost"
                            size="sm"
                            class="gap-1.5 rounded-lg px-2 text-xs"
                        >
                            <LockKeyhole size={14} aria-hidden="true" />
                            {permission}
                            <ChevronDown
                                size={12}
                                class="text-foreground-muted"
                                aria-hidden="true"
                            />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content class="min-w-48">
                            <DropdownMenu.Label>Permission</DropdownMenu.Label>
                            {#each permissions as option (option)}
                                <DropdownMenu.Item onclick={() => (permission = option)}>
                                    <span class="flex-1">{option}</span>
                                    {#if permission === option}<Check
                                            size={13}
                                            aria-hidden="true"
                                        />{/if}
                                </DropdownMenu.Item>
                            {/each}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </PromptComposer.Actions>

                <PromptComposer.Submit />
            </PromptComposer.Toolbar>
        </PromptComposer.Root>
    </Attachment.Root>

    <p class="px-1 text-xs text-foreground-muted" role="status" aria-live="polite">
        {message}{files.length
            ? ` · ${files.length} ${files.length === 1 ? 'file' : 'files'} attached`
            : ''}
    </p>
</div>
