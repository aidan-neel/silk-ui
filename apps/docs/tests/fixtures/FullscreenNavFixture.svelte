<script lang="ts">
import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';

let { open = $bindable(false) } = $props();
</script>

<FullscreenNav.Root bind:open>
    <FullscreenNav.Trigger data-testid="trigger" />
    <FullscreenNav.Content>
        <div class="flex items-center justify-between">
            <span>Example</span>
            <FullscreenNav.Close>Close</FullscreenNav.Close>
        </div>
        <FullscreenNav.Group heading="Menu">
            <FullscreenNav.Link href="#home">Home</FullscreenNav.Link>
            <FullscreenNav.Link href="#docs">Docs</FullscreenNav.Link>
        </FullscreenNav.Group>
    </FullscreenNav.Content>
</FullscreenNav.Root>
