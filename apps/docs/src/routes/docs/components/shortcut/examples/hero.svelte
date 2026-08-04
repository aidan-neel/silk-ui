<script lang="ts">
import Shortcut from '@sivir-ui/svelte/components/shortcut';
import { toast } from '@sivir-ui/svelte/components/toast';

function ontrigger() {
    toast({
        title: 'Shortcut activated',
        description: 'Pressed K',
        duration: 2000,
        type: 'success'
    });
}
</script>

<div class="flex flex-col items-center gap-4">
    <Shortcut shortcut="K" {ontrigger} />
    <p class="m-0 text-sm text-foreground-muted">Press <kbd class="font-mono">K</kbd> to trigger</p>
</div>
