<script lang="ts">
    import ExternalLink from '@lucide/svelte/icons/external-link';
    import RefreshCw from '@lucide/svelte/icons/refresh-cw';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';

    const code = `SELECT id, email, created_at
FROM users
WHERE created_at > now() - interval '7 days'
ORDER BY created_at DESC
LIMIT 50;`;
</script>

<CodeBlock.Root class="max-w-xl" value="sql">
    <CodeBlock.Header>
        <CodeBlock.Actions>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Button variant="ghost" size="icon" aria-label="Run query">
                        <RefreshCw size={15} />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Run query</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Button variant="ghost" size="icon" aria-label="Open in editor">
                        <ExternalLink size={15} />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Open in editor</Tooltip.Content>
            </Tooltip.Root>
        </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content value="sql" {code} lang="sql" />
</CodeBlock.Root>
