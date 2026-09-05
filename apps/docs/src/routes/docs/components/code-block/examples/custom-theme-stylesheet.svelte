<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

    const code = `export async function getUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}`;
</script>

<!-- theme="custom" skips Sivir's token colors, so these stock-style
     highlight.js selectors paint the tokens instead. -->
<CodeBlock {code} lang="typescript" copy="overlay" theme="custom" class="demo-hljs-onedark" />

<style>
    /* One Dark / One Light inspired token colors, scoped to this demo. */
    :global(.demo-hljs-onedark .hljs-comment),
    :global(.demo-hljs-onedark .hljs-quote) {
        color: #a0a1a7;
        font-style: italic;
    }
    :global(.demo-hljs-onedark .hljs-keyword),
    :global(.demo-hljs-onedark .hljs-selector-tag),
    :global(.demo-hljs-onedark .hljs-literal),
    :global(.demo-hljs-onedark .hljs-section),
    :global(.demo-hljs-onedark .hljs-link) {
        color: #a626a4;
    }
    :global(.demo-hljs-onedark .hljs-string),
    :global(.demo-hljs-onedark .hljs-regexp) {
        color: #50a14f;
    }
    :global(.demo-hljs-onedark .hljs-number) {
        color: #986801;
    }
    :global(.demo-hljs-onedark .hljs-title),
    :global(.demo-hljs-onedark .hljs-title.function_) {
        color: #4078f2;
    }
    :global(.demo-hljs-onedark .hljs-attr),
    :global(.demo-hljs-onedark .hljs-attribute),
    :global(.demo-hljs-onedark .hljs-property),
    :global(.demo-hljs-onedark .hljs-variable) {
        color: #e45649;
    }
    :global(.demo-hljs-onedark .hljs-built_in),
    :global(.demo-hljs-onedark .hljs-type) {
        color: #0184bc;
    }
    :global(.demo-hljs-onedark .hljs-meta) {
        color: #383a42;
    }

    :global(.dark .demo-hljs-onedark .hljs-comment),
    :global(.dark .demo-hljs-onedark .hljs-quote) {
        color: #7f848e;
    }
    :global(.dark .demo-hljs-onedark .hljs-keyword),
    :global(.dark .demo-hljs-onedark .hljs-selector-tag),
    :global(.dark .demo-hljs-onedark .hljs-literal),
    :global(.dark .demo-hljs-onedark .hljs-section),
    :global(.dark .demo-hljs-onedark .hljs-link) {
        color: #c678dd;
    }
    :global(.dark .demo-hljs-onedark .hljs-string),
    :global(.dark .demo-hljs-onedark .hljs-regexp) {
        color: #98c379;
    }
    :global(.dark .demo-hljs-onedark .hljs-number) {
        color: #d19a66;
    }
    :global(.dark .demo-hljs-onedark .hljs-title),
    :global(.dark .demo-hljs-onedark .hljs-title.function_) {
        color: #61afef;
    }
    :global(.dark .demo-hljs-onedark .hljs-attr),
    :global(.dark .demo-hljs-onedark .hljs-attribute),
    :global(.dark .demo-hljs-onedark .hljs-property),
    :global(.dark .demo-hljs-onedark .hljs-variable) {
        color: #e06c75;
    }
    :global(.dark .demo-hljs-onedark .hljs-built_in),
    :global(.dark .demo-hljs-onedark .hljs-type) {
        color: #e5c07b;
    }
    :global(.dark .demo-hljs-onedark .hljs-meta) {
        color: #abb2bf;
    }
</style>
