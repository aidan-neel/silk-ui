<script lang="ts">
    import FolderKanban from '@lucide/svelte/icons/folder-kanban';
    import Home from '@lucide/svelte/icons/home';
    import Inbox from '@lucide/svelte/icons/inbox';
    import Menu from '@lucide/svelte/icons/menu';
    import Settings from '@lucide/svelte/icons/settings';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
</script>

<Sheet.Root>
    <Sheet.Trigger variant="outline">
        <Menu size={14} />
        Menu
    </Sheet.Trigger>
    <Sheet.Content side="left">
        <Sheet.Header>
            <Sheet.Title>Navigation</Sheet.Title>
            <Sheet.Description>Jump to a section of the app.</Sheet.Description>
        </Sheet.Header>

        <div class="flex flex-col gap-1 py-4">
            <Button variant="ghost" class="w-full justify-start gap-2">
                <Home size={16} />
                Home
            </Button>
            <Button variant="ghost" class="w-full justify-start gap-2">
                <Inbox size={16} />
                Inbox
                <Badge variant="secondary" class="ml-auto">3</Badge>
            </Button>
            <Button variant="ghost" class="w-full justify-start gap-2">
                <FolderKanban size={16} />
                Projects
            </Button>
            <Button variant="ghost" class="w-full justify-start gap-2">
                <Settings size={16} />
                Settings
            </Button>
        </div>

        <div class="h-px w-full bg-border" role="separator"></div>

        <div class="flex items-center gap-3 py-4">
            <Avatar.Root size="sm">
                <Avatar.Fallback>AN</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex min-w-0 flex-col">
                <span
                    class="truncate text-sm [font-weight:var(--font-weight-label,500)] text-foreground"
                    >Aidan N.</span
                >
                <span class="truncate text-xs text-foreground-muted">aidan@sivir.ui</span>
            </div>
        </div>

        <Sheet.Footer>
            <Sheet.Close class="w-full" variant="outline">Close</Sheet.Close>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
