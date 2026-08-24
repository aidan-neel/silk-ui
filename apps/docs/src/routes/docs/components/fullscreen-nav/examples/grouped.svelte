<script lang="ts">
    import Menu from '@lucide/svelte/icons/menu';
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
</script>

<FullscreenNav.Root>
    <FullscreenNav.Trigger size="md" class="gap-2 px-3">
        <Menu size={16} />
        Browse
    </FullscreenNav.Trigger>
    <FullscreenNav.Content label="Product navigation">
        <header class="flex items-center justify-between">
            <span class="font-[var(--font-header)] text-lg font-semibold tracking-tight">Acme</span>
            <FullscreenNav.Close />
        </header>

        <div class="mt-12 flex flex-col gap-10">
            <FullscreenNav.Group heading="Product">
                <FullscreenNav.Link href="#product">Overview</FullscreenNav.Link>
                <FullscreenNav.Link href="#changelog">Changelog</FullscreenNav.Link>
                <FullscreenNav.Link href="#pricing">Pricing</FullscreenNav.Link>
            </FullscreenNav.Group>

            <FullscreenNav.Group heading="Learn">
                <FullscreenNav.Link href="#guides">Guides</FullscreenNav.Link>
                <FullscreenNav.Link href="#api">API reference</FullscreenNav.Link>
                <FullscreenNav.Link href="#community">Community</FullscreenNav.Link>
            </FullscreenNav.Group>
        </div>
    </FullscreenNav.Content>
</FullscreenNav.Root>
