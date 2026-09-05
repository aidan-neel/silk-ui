<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';

    // The canonical command is either the `bunx …` runner form or the
    // `bun add …` dependency form (every page passes one of those). Other
    // package managers are derived per form, so call sites stay a single prop.
    let { command }: { command: string } = $props();

    const runnerRest = $derived(command.match(/^bunx\s+(.+)$/)?.[1]);
    const addPkgs = $derived(command.match(/^(?:bun|pnpm|npm|yarn)\s+add\s+(.+)$/)?.[1]);

    const managers = [
        { id: 'bun', label: 'bun', exec: 'bunx', add: 'bun add' },
        { id: 'pnpm', label: 'pnpm', exec: 'pnpm dlx', add: 'pnpm add' },
        { id: 'npm', label: 'npm', exec: 'npx', add: 'npm i' },
        { id: 'yarn', label: 'yarn', exec: 'yarn dlx', add: 'yarn add' }
    ];

    const tabs = $derived(
        managers.map((m) => {
            let code: string;
            if (runnerRest != null) {
                code = `${m.exec} ${runnerRest}`;
            } else if (addPkgs != null) {
                code = `${m.add} ${addPkgs}`;
            } else {
                code = command;
            }
            return {
                label: m.label,
                lang: 'bash',
                value: m.id,
                code
            };
        })
    );
</script>

<div class="flex flex-col gap-4">
    <Typography.Text variant="supporting">
        Copy the command below and run it in your terminal.
    </Typography.Text>
    <CodeBlock {tabs} />
</div>
