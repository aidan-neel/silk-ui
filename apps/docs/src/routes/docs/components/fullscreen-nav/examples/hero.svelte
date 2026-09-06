<script lang="ts">
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
</script>

<FullscreenNav.Root>
    <FullscreenNav.Trigger aria-label="Open example navigation" />
    <FullscreenNav.Content label="Example navigation">
        <header class="flex items-center justify-between py-1">
            <span class="font-[var(--font-header)] text-lg font-semibold tracking-tight"
                >Sivir</span
            >
            <FullscreenNav.Close />
        </header>

        <div class="mt-12 flex flex-col gap-10">
            <FullscreenNav.Group heading="Explore">
                <FullscreenNav.Link href="#overview">Overview</FullscreenNav.Link>
                <FullscreenNav.Link href="#components">Components</FullscreenNav.Link>
                <FullscreenNav.Link href="#themes">Themes</FullscreenNav.Link>
            </FullscreenNav.Group>

            <FullscreenNav.Group heading="Resources">
                <FullscreenNav.Link href="#documentation">Documentation</FullscreenNav.Link>
                <FullscreenNav.Link href="#github">GitHub</FullscreenNav.Link>
            </FullscreenNav.Group>
        </div>
    </FullscreenNav.Content>
</FullscreenNav.Root>
