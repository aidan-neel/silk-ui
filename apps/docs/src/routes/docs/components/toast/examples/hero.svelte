<script lang="ts">
import { Button } from '@sivir-ui/svelte/components/button';
import { toast } from '@sivir-ui/svelte/components/toast';
</script>

<div class="flex items-center justify-center">
    <Button
        onclick={() =>
            toast.success('Deployment ready', {
                description: 'sivir-ui.vercel.app is now live.',
                actions: [
                    {
                        label: 'Visit',
                        callback: () => {
                            window.open('https://vercel.com', '_blank');
                        }
                    }
                ]
            })}>Deploy</Button
    >
</div>
