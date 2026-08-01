<!-- token-lint-disable-file -->
<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import type { MarkdownTableCell, MarkdownToken } from './_types';
    import Self from './markdown-token.svelte';

    let { tokens }: { tokens: MarkdownToken[] } = $props();

    function safeUrl(value?: string) {
        const url = value?.trim();
        if (!url) return undefined;

        const compact = url.replace(/[\u0000-\u0020]/g, '');
        const scheme = compact.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
        if (scheme && scheme !== 'http' && scheme !== 'https' && scheme !== 'mailto') {
            return undefined;
        }

        return url;
    }

    function isExternalUrl(value: string) {
        return /^(?:https?:|\/\/)/i.test(value.replace(/[\u0000-\u0020]/g, ''));
    }

    function safeImageUrl(value?: string) {
        const url = safeUrl(value);
        if (!url) return undefined;
        try {
            const base = new URL('https://sivir.invalid/');
            return new URL(url, base).origin === base.origin ? url : undefined;
        } catch {
            return undefined;
        }
    }

    function codeLanguage(value?: string) {
        return value?.trim().split(/\s+/, 1)[0] || undefined;
    }

    function listStart(value?: number | string) {
        const start = typeof value === 'number' ? value : Number.parseInt(value ?? '', 10);
        return Number.isFinite(start) ? start : undefined;
    }

    function cellTokens(cell: MarkdownTableCell) {
        return cell.tokens ?? [{ type: 'text', text: cell.text ?? '' }];
    }

    function alignmentClass(alignment?: 'center' | 'left' | 'right' | null) {
        return alignment === 'center'
            ? 'text-center'
            : alignment === 'right'
              ? 'text-right'
              : 'text-left';
    }

    function tokenKey(token: MarkdownToken, index: number) {
        return `${index}:${token.type}:${(token.raw ?? token.text ?? '').slice(0, 80)}`;
    }

    function cellKey(cell: MarkdownTableCell, index: number) {
        return `${index}:${(cell.text ?? '').slice(0, 80)}`;
    }

    function rowKey(row: MarkdownTableCell[], index: number) {
        return `${index}:${row
            .map((cell) => cell.text ?? '')
            .join('|')
            .slice(0, 120)}`;
    }
</script>

{#each tokens as token, index (tokenKey(token, index))}
    {#if token.type === 'space' || token.type === 'def'}
        <!-- Markdown spacing and reference definitions do not produce visible nodes. -->
    {:else if token.type === 'heading'}
        {#if token.depth === 1}
            <h1
                class="mb-3 mt-7 text-[1.25rem] leading-[1.2] font-semibold tracking-[-0.02em] text-balance text-foreground"
            >
                <Self tokens={token.tokens ?? []} />
            </h1>
        {:else if token.depth === 2}
            <h2
                class="mb-2.5 mt-6 text-[1.1rem] leading-[1.25] font-semibold tracking-[-0.015em] text-balance text-foreground"
            >
                <Self tokens={token.tokens ?? []} />
            </h2>
        {:else if token.depth === 3}
            <h3
                class="mb-2 mt-5 text-[0.95rem] leading-snug font-semibold text-balance text-foreground"
            >
                <Self tokens={token.tokens ?? []} />
            </h3>
        {:else if token.depth === 4}
            <h4 class="mb-2 mt-5 font-semibold text-balance text-foreground">
                <Self tokens={token.tokens ?? []} />
            </h4>
        {:else if token.depth === 5}
            <h5 class="mb-2 mt-4 font-semibold text-balance text-foreground-muted">
                <Self tokens={token.tokens ?? []} />
            </h5>
        {:else}
            <h6 class="mb-2 mt-4 font-medium text-balance text-foreground-muted">
                <Self tokens={token.tokens ?? []} />
            </h6>
        {/if}
    {:else if token.type === 'paragraph'}
        <p class="my-3 text-pretty">
            <Self tokens={token.tokens ?? [{ type: 'text', text: token.text ?? '' }]} />
        </p>
    {:else if token.type === 'strong'}
        <strong class="font-semibold text-foreground">
            <Self tokens={token.tokens ?? [{ type: 'text', text: token.text ?? '' }]} />
        </strong>
    {:else if token.type === 'em'}
        <em>
            <Self tokens={token.tokens ?? [{ type: 'text', text: token.text ?? '' }]} />
        </em>
    {:else if token.type === 'del'}
        <del class="decoration-foreground-muted/70">
            <Self tokens={token.tokens ?? [{ type: 'text', text: token.text ?? '' }]} />
        </del>
    {:else if token.type === 'codespan'}
        <code
            class="rounded-[var(--radius-sm)] bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-foreground [box-decoration-break:clone] [overflow-wrap:anywhere]"
            >{token.text ?? ''}</code
        >
    {:else if token.type === 'code'}
        <CodeBlock
            code={token.text ?? ''}
            lang={codeLanguage(token.lang)}
            copy="overlay"
            class="my-4"
        />
    {:else if token.type === 'link'}
        {@const href = safeUrl(token.href)}
        {#if href}
            <a
                {href}
                title={token.title ?? undefined}
                target={isExternalUrl(href) ? '_blank' : undefined}
                rel={isExternalUrl(href) ? 'noopener noreferrer' : undefined}
                class="break-words text-primary underline decoration-primary/50 underline-offset-2 [text-decoration-skip-ink:auto] [text-decoration-thickness:from-font] [text-underline-position:from-font] hover:decoration-primary focus-visible:rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            >
                <Self tokens={token.tokens ?? [{ type: 'text', text: token.text ?? href }]} />
            </a>
        {:else}
            <span data-unsafe-url>
                <Self
                    tokens={token.tokens ?? [
                        { type: 'text', text: token.text ?? token.href ?? '' }
                    ]}
                />
            </span>
        {/if}
    {:else if token.type === 'image'}
        {@const src = safeImageUrl(token.href)}
        {#if src}
            <img
                {src}
                alt={token.text ?? ''}
                title={token.title ?? undefined}
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
                class="my-4 h-auto max-w-full rounded-[var(--radius-md)] outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            />
        {:else}
            {token.text ?? ''}
        {/if}
    {:else if token.type === 'list'}
        {#if token.ordered}
            <ol
                start={listStart(token.start)}
                class="my-3 list-decimal space-y-1 ps-5 marker:text-foreground-muted"
            >
                {#each token.items ?? [] as item, index (tokenKey(item, index))}
                    <li class={item.task ? 'relative list-none' : undefined}>
                        {#if item.task}
                            <input
                                type="checkbox"
                                checked={item.checked}
                                disabled
                                aria-label={item.checked ? 'Completed task' : 'Incomplete task'}
                                class="absolute top-[0.32em] -start-5 size-3.5 accent-primary"
                            />
                        {/if}
                        <Self tokens={item.tokens ?? [{ type: 'text', text: item.text ?? '' }]} />
                    </li>
                {/each}
            </ol>
        {:else}
            <ul class="my-3 list-disc space-y-1 ps-5 marker:text-foreground-muted">
                {#each token.items ?? [] as item, index (tokenKey(item, index))}
                    <li class={item.task ? 'relative list-none' : undefined}>
                        {#if item.task}
                            <input
                                type="checkbox"
                                checked={item.checked}
                                disabled
                                aria-label={item.checked ? 'Completed task' : 'Incomplete task'}
                                class="absolute top-[0.32em] -start-5 size-3.5 accent-primary"
                            />
                        {/if}
                        <Self tokens={item.tokens ?? [{ type: 'text', text: item.text ?? '' }]} />
                    </li>
                {/each}
            </ul>
        {/if}
    {:else if token.type === 'checkbox'}
        <!-- Task-list checkboxes are rendered by the containing list item. -->
    {:else if token.type === 'blockquote'}
        <blockquote class="my-4 border-s-2 border-border ps-4 text-foreground-muted">
            <Self tokens={token.tokens ?? [{ type: 'text', text: token.text ?? '' }]} />
        </blockquote>
    {:else if token.type === 'hr'}
        <hr class="my-6 border-0 border-t border-border" />
    {:else if token.type === 'table'}
        <!-- Named overflow regions need keyboard scrolling. -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
            role="region"
            aria-label="Markdown table"
            tabindex="0"
            class="my-4 max-w-full overflow-x-auto rounded-[var(--radius-md)] border border-border focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
        >
            <table class="w-full min-w-max border-collapse text-[0.925em]">
                <thead class="bg-secondary/60 text-foreground">
                    <tr>
                        {#each token.header ?? [] as cell, column (cellKey(cell, column))}
                            <th
                                scope="col"
                                class={`border-b border-border px-3 py-2 font-semibold ${alignmentClass(token.align?.[column])}`}
                            >
                                <Self tokens={cellTokens(cell)} />
                            </th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each token.rows ?? [] as row, rowIndex (rowKey(row, rowIndex))}
                        <tr class="border-b border-border/70 last:border-b-0">
                            {#each row as cell, column (cellKey(cell, column))}
                                <td
                                    class={`px-3 py-2 align-top ${alignmentClass(token.align?.[column])}`}
                                >
                                    <Self tokens={cellTokens(cell)} />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else if token.type === 'br'}
        <br />
    {:else if token.type === 'html'}
        {#if token.block}
            <pre
                class="my-3 overflow-x-auto whitespace-pre-wrap rounded-[var(--radius-md)] border border-border bg-secondary/50 px-3 py-2 font-mono text-[0.875em] leading-relaxed text-foreground-muted"><code
                    >{token.text ?? token.raw ?? ''}</code
                ></pre>
        {:else}
            <span class="font-mono text-[0.875em] text-foreground-muted"
                >{token.text ?? token.raw ?? ''}</span
            >
        {/if}
    {:else if token.tokens?.length}
        <Self tokens={token.tokens} />
    {:else}
        {token.text ?? token.raw ?? ''}
    {/if}
{/each}
