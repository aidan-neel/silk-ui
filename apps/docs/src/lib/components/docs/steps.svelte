<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import type { Snippet } from 'svelte';

    interface StepItem {
        title?: string;
        description?: string;
    }

    let {
        steps = [],
        class: classProp = '',
        children
    }: {
        steps?: StepItem[];
        class?: string;
        children?: Snippet;
    } = $props();
</script>

<div class={`flex flex-col gap-0 ${classProp}`}>
    {#each steps as step, index (index)}
        <div class="flex gap-4 pb-6">
            <!-- Left guide line -->
            <div class="relative flex flex-col items-center">
                <div
                    class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-card text-sm font-semibold text-foreground"
                >
                    {index + 1}
                </div>
                {#if index < steps.length - 1}
                    <div class="absolute top-8 bottom-0 h-12 w-0.5 bg-border"></div>
                {/if}
            </div>

            <!-- Content -->
            <div class="flex flex-col gap-2 pt-0.5 flex-1">
                {#if step.title}
                    <h3 class="text-sm font-semibold text-foreground">
                        {step.title}
                    </h3>
                {/if}
                {#if step.description}
                    <Typography.Text variant="supporting">
                        {step.description}
                    </Typography.Text>
                {/if}
                {#if index === 0 && children}
                    <div class="mt-2">
                        {@render children()}
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>
