<script lang="ts">
    import Download from '@lucide/svelte/icons/download';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';

    const sh = `npm install @sivir-ui/svelte
npx sivir add code-block`;

    const yaml = `name: ci
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test`;
</script>

<CodeBlock.Root class="max-w-xl" value="shell">
    <CodeBlock.Header>
        <CodeBlock.List>
            <CodeBlock.Trigger value="shell">Terminal</CodeBlock.Trigger>
            <CodeBlock.Trigger value="yaml">ci.yml</CodeBlock.Trigger>
        </CodeBlock.List>
        <CodeBlock.Actions>
            <Button variant="ghost" size="icon" aria-label="Download">
                <Download size={15} />
            </Button>
        </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content value="shell" code={sh} lang="bash" />
    <CodeBlock.Content value="yaml" code={yaml} lang="yaml" />
</CodeBlock.Root>
