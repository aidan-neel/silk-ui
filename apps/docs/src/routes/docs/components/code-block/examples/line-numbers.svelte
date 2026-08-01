<script lang="ts">
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';

    const code = `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])`;
</script>

<CodeBlock.Root class="max-w-xl" value="py">
    <CodeBlock.Content value="py" {code} lang="python" showLineNumbers />
</CodeBlock.Root>
