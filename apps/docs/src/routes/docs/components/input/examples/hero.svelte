<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';

    let projectName = $state('sivir-ui');
    let rootDirectory = $state('./');
</script>

<div class="w-full max-w-sm space-y-6">
    <h2 class="text-sm [font-weight:var(--font-weight-label,600)] text-foreground">
        Configure Project
    </h2>

    <div class="space-y-4">
        <Input
            label="Project Name"
            bind:value={projectName}
            description="This is your project's visible name on Vercel."
        />

        <Input
            label="Root Directory"
            placeholder="./"
            bind:value={rootDirectory}
            description="The directory where your source code lives."
        />
    </div>

    <div class="flex items-center justify-end gap-3">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button size="sm">Deploy</Button>
    </div>
</div>
