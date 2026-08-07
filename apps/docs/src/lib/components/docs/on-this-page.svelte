<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { page } from '$app/state';

    type TocItem = {
        id: string;
        text: string;
        level: number;
    };

    let {
        class: className = ''
    }: {
        class?: string;
    } = $props();

    let items = $state<TocItem[]>([]);

    const selector = ['.docs-section-heading', '.docs-subsection-heading', 'h1', 'h2', 'h3'].join(
        ', '
    );

    function slugify(text: string) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[`']/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function levelFor(element: Element) {
        if (element.classList.contains('docs-subsection-heading')) return 1;
        if (element.classList.contains('h3') || element.tagName === 'H3') return 2;
        if (element.classList.contains('h2') || element.tagName === 'H2') return 1;
        return 0;
    }

    function buildToc(root: HTMLElement) {
        // Local, non-reactive dedup helper — SvelteMap is unnecessary here.
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const seen = new Map<string, number>();

        items = Array.from(root.querySelectorAll(selector))
            .filter((node): node is HTMLElement => node instanceof HTMLElement)
            .filter((node) => !node.closest('[data-page-header]'))
            .filter((node) => !node.closest('[data-component-preview]'))
            .map((node) => {
                const text = node.textContent?.trim() ?? '';
                const tocText = node.dataset.tocLabel?.trim() || text;
                if (!text || !tocText) return null;

                const baseId = slugify(text);
                const count = seen.get(baseId) ?? 0;
                seen.set(baseId, count + 1);

                const id = node.id || (count === 0 ? baseId : `${baseId}-${count + 1}`);
                node.id = id;
                node.style.scrollMarginTop = '6rem';

                return {
                    id,
                    text: tocText,
                    level: levelFor(node)
                };
            })
            .filter((item): item is TocItem => item !== null);
    }

    async function refreshToc() {
        if (typeof window === 'undefined') return;
        await tick();

        const root = document.querySelector('[data-docs-page]');
        if (!(root instanceof HTMLElement)) {
            items = [];
            return;
        }

        buildToc(root);
    }

    onMount(() => {
        void refreshToc();
    });

    $effect(() => {
        // Touch the pathname so this effect re-runs on navigation.
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        page.url.pathname;
        void refreshToc();
    });
</script>

{#if items.length > 0}
    <aside class={`text-sm ${className}`}>
        <p
            class="mb-4 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
        >
            On This Page
        </p>
        <nav aria-label="On this page">
            <ul class="space-y-1.5 text-[0.96rem] text-foreground-muted">
                {#each items as item (item.id)}
                    <li>
                        <a
                            class="block rounded-sm py-1 transition-colors hover:text-foreground"
                            class:pl-0={item.level === 0}
                            class:pl-4={item.level === 1}
                            class:pl-8={item.level > 1}
                            href={`#${item.id}`}
                        >
                            {item.text}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </aside>
{/if}
