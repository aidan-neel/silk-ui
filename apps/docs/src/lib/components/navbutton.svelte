<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import type { Snippet } from 'svelte';
    import { page } from '$app/state';

    type Props = {
        href: string;
        children: Snippet;
        mobile?: boolean;
        onclick?: () => void;
    };

    let { href, children, mobile = false, onclick }: Props = $props();
    const active = $derived(
        page.url.pathname === href ||
            (href === '/studio' && page.url.pathname.startsWith('/studio'))
    );
    const docLanding = [
        '/docs/introduction',
        '/docs/installation',
        '/docs/theming',
        '/docs/components'
    ];
</script>

<Button
    {href}
    {onclick}
    variant="ghost"
    class={active || (href === '/docs/introduction' && docLanding.includes(page.url.pathname))
        ? mobile
            ? 'h-10 w-full justify-start rounded-lg bg-secondary/85 duration-200 px-3 [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground'
            : 'rounded-lg bg-secondary px-4 [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground duration-200'
        : mobile
          ? 'h-10 w-full justify-start rounded-lg px-3 text-foreground-muted hover:bg-secondary duration-200 hover:text-foreground'
          : 'rounded-lg px-4 text-foreground-muted hover:bg-secondary/50 hover:text-foreground duration-200'}
    aria-current={active || (href === '/docs/introduction' && docLanding.includes(page.url.pathname))
        ? 'page'
        : undefined}
>
    {@render children?.()}
</Button>
