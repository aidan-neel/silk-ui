<script lang="ts">
    import type { ButtonStatus } from '@sivir-ui/svelte/components/button';
    import { Button } from '@sivir-ui/svelte/components/button';

    let status = $state<ButtonStatus>('idle');
    let timer: ReturnType<typeof setTimeout> | undefined;

    function publish() {
        if (status === 'loading') return;
        clearTimeout(timer);
        status = 'loading';
        timer = setTimeout(() => {
            status = 'success';
            timer = setTimeout(() => (status = 'idle'), 1200);
        }, 1100);
    }
</script>

<Button {status} loadingLabel="Publishing…" successLabel="Published" onclick={publish}>
    Publish
</Button>
