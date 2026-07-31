<script lang="ts">
	import * as CodeBlock from '@sivir-ui/svelte/components/code-block';

	const ts = `export async function getUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}`;

	const py = `import httpx

async def get_user(id: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"/api/users/{id}")
        res.raise_for_status()
        return res.json()`;

	const go = `func GetUser(id string) (*User, error) {
    res, err := http.Get("/api/users/" + id)
    if err != nil {
        return nil, err
    }
    defer res.Body.Close()
    return decode(res.Body)
}`;
</script>

<CodeBlock.Root class="max-w-xl" value="typescript">
	<CodeBlock.Header>
		<CodeBlock.List>
			<CodeBlock.Trigger value="typescript">TypeScript</CodeBlock.Trigger>
			<CodeBlock.Trigger value="python">Python</CodeBlock.Trigger>
			<CodeBlock.Trigger value="go">Go</CodeBlock.Trigger>
		</CodeBlock.List>
		<CodeBlock.Actions />
	</CodeBlock.Header>
	<CodeBlock.Content value="typescript" code={ts} lang="typescript" />
	<CodeBlock.Content value="python" code={py} lang="python" />
	<CodeBlock.Content value="go" code={go} lang="go" />
</CodeBlock.Root>
