<script lang="ts">
    import Info from '@lucide/svelte/icons/info';
    import Sparkles from '@lucide/svelte/icons/sparkles';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import csharp from './snippets/quickstart.cs.txt?raw';
    import go from './snippets/quickstart.go.txt?raw';
    import java from './snippets/quickstart.java.txt?raw';
    import javascript from './snippets/quickstart.js.txt?raw';
    // Loaded as raw text so the sample `import` lines aren't seen by the bundler.
    import python from './snippets/quickstart.py.txt?raw';
</script>

<CodeBlock.Root class="max-w-2xl" value="javascript">
    <CodeBlock.Header>
        <CodeBlock.List>
            <CodeBlock.Trigger value="python">Python</CodeBlock.Trigger>
            <CodeBlock.Trigger value="javascript">JavaScript</CodeBlock.Trigger>
            <CodeBlock.Trigger value="java">Java</CodeBlock.Trigger>
            <CodeBlock.Trigger value="go">Go</CodeBlock.Trigger>
            <CodeBlock.Trigger value="csharp">C#</CodeBlock.Trigger>
        </CodeBlock.List>
        <CodeBlock.Actions>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Button variant="ghost" size="icon" aria-label="About this snippet">
                        <Info size={15} />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>About this snippet</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Button variant="ghost" size="icon" aria-label="Explain with AI">
                        <Sparkles size={15} />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Explain with AI</Tooltip.Content>
            </Tooltip.Root>
        </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content value="python" code={python} lang="python" />
    <CodeBlock.Content value="javascript" code={javascript} lang="javascript" />
    <CodeBlock.Content value="java" code={java} lang="java" />
    <CodeBlock.Content value="go" code={go} lang="go" />
    <CodeBlock.Content value="csharp" code={csharp} lang="csharp" />
</CodeBlock.Root>
