<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TaskStepStatus, TaskStepsProps } from '.';

    let {
        steps,
        current,
        failed = false,
        label = 'Task progress',
        class: className,
        ...rest
    }: TaskStepsProps = $props();

    const complete = $derived(!failed && current >= steps.length);
    const rows = $derived(
        steps.map((step, index) => ({
            ...step,
            status: (index < current
                ? 'done'
                : index === current && failed
                  ? 'error'
                  : index === current && !complete
                    ? 'active'
                    : 'pending') as TaskStepStatus
        }))
    );
    const sentence = $derived.by(() => {
        if (failed)
            return `Failed at ${steps[Math.min(current, steps.length - 1)]?.label ?? 'step'}.`;
        if (complete) return `All ${steps.length} steps complete.`;
        const active = rows.find((row) => row.status === 'active');
        return active ? `${active.label}, step ${current + 1} of ${steps.length}.` : '';
    });
    let spoken = $state('');

    $effect(() => {
        if (!sentence) return;
        const timer = setTimeout(() => {
            spoken = sentence;
        }, 500);
        return () => clearTimeout(timer);
    });
</script>

<div {...rest} data-ui="task-steps" class={cn(className, 'w-full')}>
    <ol aria-label={label} class="space-y-0.5">
        {#each rows as row (row.id)}
            <li
                aria-current={row.status === 'active' ? 'step' : undefined}
                data-status={row.status}
                class="flex h-7 items-center gap-2.5 px-1"
            >
                <span class="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
                    {#key row.status}
                        {#if row.status === 'done'}
                            <span
                                class="sivir-task-mark grid size-4 place-items-center rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)] text-[var(--color-success)]"
                            >
                                <svg viewBox="0 0 12 12" class="size-3" fill="none">
                                    <path
                                        d="M2.4 6.2 4.8 8.5 9.6 3.5"
                                        stroke="currentColor"
                                        stroke-width="1.7"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                        {:else if row.status === 'error'}
                            <span
                                class="sivir-task-mark grid size-4 place-items-center rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-error)_13%,transparent)] text-[var(--color-error)]"
                            >
                                <svg viewBox="0 0 12 12" class="size-3" fill="none">
                                    <path
                                        d="M3 3l6 6M9 3 3 9"
                                        stroke="currentColor"
                                        stroke-width="1.7"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </span>
                        {:else if row.status === 'active'}
                            <svg
                                class="sivir-task-spinner size-3 text-foreground-muted"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <circle
                                    cx="8"
                                    cy="8"
                                    r="6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    opacity="0.25"
                                />
                                <path
                                    d="M8 2a6 6 0 0 1 6 6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        {:else}
                            <!-- token-lint-disable-next-line no-literal-length -->
                            <span class="size-[5px] rounded-[2px] bg-border-strong"></span>
                        {/if}
                    {/key}
                </span>

                <span
                    class={cn(
                        'min-w-0 flex-1 truncate text-[length:var(--font-size-label)] transition-colors [transition-duration:var(--motion-duration-press)]',
                        row.status === 'active' &&
                            '[font-weight:var(--font-weight-label)] text-foreground',
                        row.status === 'done' && 'text-foreground',
                        row.status === 'error' &&
                            '[font-weight:var(--font-weight-label)] text-[var(--color-error)]',
                        row.status === 'pending' && 'text-foreground-muted/65'
                    )}
                >
                    {row.label}
                </span>

                {#if row.meta}
                    <span
                        aria-hidden={row.status !== 'done'}
                        class={cn(
                            // token-lint-disable-next-line no-literal-length
                            'shrink-0 font-mono text-[10.5px] tabular-nums text-foreground-muted transition-opacity [transition-duration:var(--motion-duration-press)]',
                            row.status === 'done' ? 'opacity-100' : 'opacity-0'
                        )}
                    >
                        {row.meta}
                    </span>
                {/if}
            </li>
        {/each}
    </ol>
    <span role="status" aria-live="polite" class="sr-only">{spoken}</span>
</div>

<style>
    .sivir-task-mark {
        animation: sivir-task-mark-in var(--motion-duration-panel) var(--ease-out) both;
    }

    .sivir-task-spinner {
        animation: sivir-task-spin 800ms linear infinite;
    }

    @keyframes sivir-task-mark-in {
        from {
            opacity: 0;
            scale: 0.4;
        }
    }

    @keyframes sivir-task-spin {
        to {
            rotate: 360deg;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-task-mark,
        .sivir-task-spinner {
            animation: none;
        }
    }
</style>
