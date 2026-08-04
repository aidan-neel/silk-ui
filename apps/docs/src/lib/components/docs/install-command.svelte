<script lang="ts">
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

// The canonical command is the `bunx …` form (every page passes that). Other
// package managers are derived by swapping the leading runner, so call sites
// stay a single prop.
let { command }: { command: string } = $props();

const rest = $derived(command.replace(/^bunx\s+/, ''));

const managers = [
    { id: 'bun', label: 'bun', exec: 'bunx' },
    { id: 'pnpm', label: 'pnpm', exec: 'pnpm dlx' },
    { id: 'npm', label: 'npm', exec: 'npx' },
    { id: 'yarn', label: 'yarn', exec: 'yarn dlx' }
];

const tabs = $derived(
    managers.map((m) => ({
        label: m.label,
        lang: 'bash',
        value: m.id,
        code: `${m.exec} ${rest}`
    }))
);
</script>

<div class="flex flex-col gap-2">
    <p class="text-sm text-foreground-muted">Copy the command below and run it in your terminal.</p>
    <CodeBlock {tabs} />
</div>
