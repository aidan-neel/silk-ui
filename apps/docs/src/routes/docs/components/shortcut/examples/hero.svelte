<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
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

<div class="flex flex-wrap items-center justify-center gap-3">
    <Button variant="ghost">
        Cancel
        <Shortcut shortcut="esc" />
    </Button>
    <Button>
        Save
        <Shortcut shortcut="enter" />
    </Button>
    <Shortcut shortcut="K" {ontrigger} />
</div>
