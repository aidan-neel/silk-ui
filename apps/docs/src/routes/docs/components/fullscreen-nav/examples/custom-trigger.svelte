<script lang="ts">
    import Menu from '@lucide/svelte/icons/menu';
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
</script>

<FullscreenNav.Root>
    <FullscreenNav.Trigger size="md" class="gap-2 px-3">
        <Menu size={16} />
        Menu
    </FullscreenNav.Trigger>
    <FullscreenNav.Content label="Account navigation">
        <header class="flex items-center justify-between">
            <span class="font-[var(--font-header)] text-lg font-semibold tracking-tight"
                >Account</span
            >
            <FullscreenNav.Close />
        </header>

        <div class="mt-12 flex flex-col gap-10">
            <FullscreenNav.Group heading="Account">
                <FullscreenNav.Link href="#profile">Profile</FullscreenNav.Link>
                <FullscreenNav.Link href="#billing">Billing</FullscreenNav.Link>
                <FullscreenNav.Link href="#settings">Settings</FullscreenNav.Link>
            </FullscreenNav.Group>
        </div>
    </FullscreenNav.Content>
</FullscreenNav.Root>
