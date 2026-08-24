<script lang="ts">
    import { type TaskStep, TaskSteps } from '@sivir-ui/svelte/components/task-steps';
    import { onMount } from 'svelte';

    const steps: TaskStep[] = [
        { id: 'queue', label: 'Queued', meta: '0.2s' },
        { id: 'build', label: 'Building', meta: '8.1s' },
        { id: 'checks', label: 'Running checks', meta: '3.4s' },
        { id: 'deploy', label: 'Deploying', meta: '5.0s' }
    ];
    let current = $state(0);
    let timer: ReturnType<typeof setInterval> | undefined;

    onMount(() => {
        timer = setInterval(() => {
            current += 1;
            if (current >= steps.length) clearInterval(timer);
        }, 900);
        return () => clearInterval(timer);
    });
</script>

<div
    class="w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-[var(--elevation-1)]"
>
    <div class="mb-3">
        <p class="font-medium text-foreground">Deploy release</p>
    </div>
    <TaskSteps {steps} {current} label="Deploy progress" />
</div>
