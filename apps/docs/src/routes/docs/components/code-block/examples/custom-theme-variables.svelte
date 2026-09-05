<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

    const code = `export async function getUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}`;
</script>

<!-- The eight --code-block-token-* variables inherit, so a wrapper can
     recolor the built-in palette per mode without a stylesheet. -->
<div class="demo-brand-tokens">
    <CodeBlock {code} lang="typescript" copy="overlay" />
</div>

<style>
    :global(.demo-brand-tokens) {
        --code-block-token-comment: #7d8590;
        --code-block-token-keyword: #a21caf;
        --code-block-token-string: #047857;
        --code-block-token-number: #b45309;
        --code-block-token-function: #4d7c0f;
        --code-block-token-property: #0e7490;
        --code-block-token-builtin: #be123c;
        --code-block-token-entity: #15803d;
        --code-block-token-meta: #64748b;
    }
    :global(.dark .demo-brand-tokens) {
        --code-block-token-comment: #8b949e;
        --code-block-token-keyword: #e879f9;
        --code-block-token-string: #34d399;
        --code-block-token-number: #fbbf24;
        --code-block-token-function: #a3e635;
        --code-block-token-property: #22d3ee;
        --code-block-token-builtin: #fb7185;
        --code-block-token-entity: #4ade80;
        --code-block-token-meta: #94a3b8;
    }
</style>
