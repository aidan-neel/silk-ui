<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';

    let tab = $state('account');
</script>

<div class="w-full max-w-lg p-2 sm:p-4">
    <Tabs.Root bind:value={tab} orientation="vertical" variant="ghost">
        <Tabs.List class="min-w-28">
            <Tabs.Trigger value="account">Account</Tabs.Trigger>
            <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
            <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="account" class="rounded-lg bg-secondary/35 p-4">
            <p class="text-sm font-medium text-foreground">Account</p>
            <p class="mt-1 text-sm leading-relaxed text-foreground-muted">
                Manage your profile and contact details.
            </p>
        </Tabs.Content>

        <Tabs.Content value="notifications" class="rounded-lg bg-secondary/35 p-4">
            <p class="text-sm font-medium text-foreground">Notifications</p>
            <p class="mt-1 text-sm leading-relaxed text-foreground-muted">
                Choose which updates you want to receive.
            </p>
        </Tabs.Content>

        <Tabs.Content value="appearance" class="rounded-lg bg-secondary/35 p-4">
            <p class="text-sm font-medium text-foreground">Appearance</p>
            <p class="mt-1 text-sm leading-relaxed text-foreground-muted">
                Adjust the theme and interface density.
            </p>
        </Tabs.Content>
    </Tabs.Root>
</div>
