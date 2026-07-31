<script lang="ts">
	import * as CodeBlock from '@sivir-ui/svelte/components/code-block';

	const code = `model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(documents)
index.upsert(vectors=zip(ids, embeddings))`;
</script>

<!-- copyPlacement="overlay" pins the copy button to the body's top-right (no header). -->
<CodeBlock.Root class="max-w-xl" value="py">
	<CodeBlock.Content value="py" {code} lang="python" copyPlacement="overlay" />
</CodeBlock.Root>
