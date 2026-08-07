<script lang="ts">
    import { TaskSteps } from '@sivir-ui/svelte/components/task-steps';

    let { current = 1, failed = false }: { current?: number; failed?: boolean } = $props();
    const steps = [
        { id: 'queue', label: 'Queued', meta: '0.2s' },
        { id: 'build', label: 'Building', meta: '8.1s' },
        { id: 'deploy', label: 'Deploying', meta: '5.0s' }
    ];
</script>

<TaskSteps {steps} {current} {failed} label="Deploy progress" />
