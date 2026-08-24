<script lang="ts">
    import GitBranch from '@lucide/svelte/icons/git-branch';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root class="w-full max-w-[28rem]">
    <Card.Header>
        <div class="flex items-center justify-between mb-2">
            <Card.Title>sivir-ui</Card.Title>
            <span
                class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
            >
                Next.js
            </span>
        </div>
        <Card.Description>vercel.com/aidan-neel/sivir-ui</Card.Description>
    </Card.Header>
    <Card.Content>
        <div class="space-y-4">
            <!-- Status Row -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span class="text-sm font-medium text-foreground">Ready</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs text-foreground-muted">Production</span>
                    <span class="text-xs text-foreground-muted">Deployed 2h ago</span>
                </div>
            </div>

            <!-- Commit Row -->
            <div class="flex items-center gap-2 rounded-sm bg-secondary px-3 py-2">
                <GitBranch class="h-4 w-4 text-foreground-muted flex-shrink-0" />
                <span class="text-sm font-medium text-foreground">main</span>
                <span class="text-xs text-foreground-muted truncate"
                    >feat(studio): restore original styling</span
                >
                <span class="ml-auto text-xs text-foreground-muted flex-shrink-0">aidan-neel</span>
            </div>
        </div>
    </Card.Content>
    <Card.Footer class="flex-col sm:flex-row">
        <Button variant="outline" class="w-full sm:w-auto">Visit</Button>
        <Button class="w-full sm:w-auto">View Deployment</Button>
    </Card.Footer>
</Card.Root>
