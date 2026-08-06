<script lang="ts">
    import AlignCenter from '@lucide/svelte/icons/align-center';
    import AlignLeft from '@lucide/svelte/icons/align-left';
    import AlignRight from '@lucide/svelte/icons/align-right';
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
    import * as Alert from '@sivir-ui/svelte/components/alert';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import { Input } from '@sivir-ui/svelte/components/input';
    import { Progress } from '@sivir-ui/svelte/components/progress';
    import { Slider } from '@sivir-ui/svelte/components/slider';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import type { Snippet } from 'svelte';
    import { resolve } from '$app/paths';

    const titleWords = ['Restyle', 'everything', 'from', 'a', 'few', 'tokens.'];

    // Real example counts, read from each component's `examples/` folder.
    const exampleModules = import.meta.glob('/src/routes/docs/components/*/examples/*.svelte');
    const counts: Record<string, number> = {};
    for (const path of Object.keys(exampleModules)) {
        const m = path.match(/components\/([^/]+)\/examples\//);
        if (m) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
    }
    const exampleCount = (slug: string) => counts[slug] ?? 0;

    type CardDef = { slug: string; title: string; desc: string; demo: Snippet };
</script>

<svelte:head>
    <title>Sivir UI · Themed Svelte components</title>
    <meta
        name="description"
        content="54 Svelte 5 components. Restyle all of them from a handful of design tokens, with no forks or overrides."
    />
</svelte:head>

<div class="home-page-bg"></div>

<!-- grid lines (draw in after the hero) -->
<div class="grid-lines" aria-hidden="true">
    <span class="gl gl--v gl--left"></span>
    <span class="gl gl--v gl--right"></span>
    <span class="gl gl--h gl--top" style="--d: 0.32s"></span>
    <span class="gl gl--h gl--bottom" style="--d: 0.4s"></span>
</div>

<section class="hero">
    <h1 class="hero__title">
        {#each titleWords as word, i (word + i)}
            <span class="word" style="--i: {i}">{word}</span>{i < titleWords.length - 1 ? ' ' : ''}
        {/each}
    </h1>

    <p class="hero__subtitle reveal" style="--d: 0.18s">Build with 54 Svelte 5 components.</p>

    <div class="hero__actions reveal" style="--d: 0.26s">
        <Button href={resolve('/docs/introduction')} size="lg">
            Get started
            <ArrowRight size={16} />
        </Button>
        <Button href={resolve('/docs/components')} variant="outline" size="lg"
            >Browse components</Button
        >
    </div>
</section>

<div class="hero-rule" aria-hidden="true" style="--d: 0.34s"></div>

<!-- ─── Component gallery ─────────────────────────────────────────── -->
{#snippet galleryCard(c: CardDef, i: number)}
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- dynamic catalog of static component routes -->
    <a class="gcard reveal" style="--d: {0.14 + i * 0.02}s" href={`/docs/components/${c.slug}`}>
        <div class="gcard__preview">
            <div class="gcard__demo">{@render c.demo()}</div>
        </div>
        <div class="gcard__body">
            <div class="gcard__heading">
                <span class="gcard__title">{c.title}</span>
                <span class="gcard__meta">
                    {exampleCount(c.slug)}
                    examples
                    <ArrowUpRight size={13} class="gcard__arrow" />
                </span>
            </div>
            <p class="gcard__desc">{c.desc}</p>
        </div>
    </a>
{/snippet}

{#snippet buttonDemo()}
    <div class="flex items-center gap-2">
        <Button size="sm">Deploy</Button>
        <Button size="sm" variant="outline">Preview</Button>
    </div>
{/snippet}
{#snippet cardDemo()}
    <Card.Root class="w-[15rem]">
        <Card.Header>
            <Card.Title>sivir-ui</Card.Title>
            <Card.Description>vercel.com/sivir-ui</Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--color-success)]"></span>
                <span class="text-sm text-foreground">Ready</span>
                <span class="ml-auto text-xs text-foreground-muted">2h ago</span>
            </div>
        </Card.Content>
    </Card.Root>
{/snippet}
{#snippet inputDemo()}
    <div class="w-[15rem]">
        <Input label="Email" value="you@example.com" />
    </div>
{/snippet}
{#snippet checkboxDemo()}
    <div class="flex flex-col gap-3">
        <Checkbox checked label="Finalize pricing" />
        <Checkbox checked label="Write the changelog" />
        <Checkbox checked={false} label="QA the navigation" />
    </div>
{/snippet}
{#snippet switchDemo()}
    <Switch switched label="Push notifications" />
{/snippet}
{#snippet badgeDemo()}
    <div class="flex items-center gap-2">
        <Badge>New</Badge>
        <Badge variant="secondary">Stable</Badge>
        <Badge variant="outline">v1</Badge>
    </div>
{/snippet}
{#snippet tabsDemo()}
    <div class="w-[16rem]">
        <Tabs.Root value="overview">
            <Tabs.List class="grid w-full grid-cols-3">
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    </div>
{/snippet}
{#snippet avatarDemo()}
    <div class="flex items-center -space-x-2">
        <Avatar.Root class="ring-2 ring-card"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
        <Avatar.Root class="ring-2 ring-card"><Avatar.Fallback>JS</Avatar.Fallback></Avatar.Root>
        <Avatar.Root class="ring-2 ring-card"><Avatar.Fallback>KP</Avatar.Fallback></Avatar.Root>
    </div>
{/snippet}
{#snippet alertDemo()}
    <div class="w-[16rem]">
        <Alert.Root variant="success">
            <Alert.Title>Deployed</Alert.Title>
            <Alert.Description>Your changes are live in production.</Alert.Description>
        </Alert.Root>
    </div>
{/snippet}
{#snippet sliderDemo()}
    <div class="w-[15rem]"><Slider value={64} label="Volume" /></div>
{/snippet}
{#snippet progressDemo()}
    <div class="w-[15rem]"><Progress value={64} /></div>
{/snippet}
{#snippet toggleDemo()}
    <ToggleGroup.Root type="single" value="center">
        <ToggleGroup.Item value="left" aria-label="Align left"
            ><AlignLeft size={14} /></ToggleGroup.Item
        >
        <ToggleGroup.Item value="center" aria-label="Align center"
            ><AlignCenter size={14} /></ToggleGroup.Item
        >
        <ToggleGroup.Item value="right" aria-label="Align right"
            ><AlignRight size={14} /></ToggleGroup.Item
        >
    </ToggleGroup.Root>
{/snippet}

<section class="gallery">
    <div class="gallery__grid">
        {@render galleryCard(
            {
                slug: 'button',
                title: 'Button',
                desc: 'Ten intent variants, four sizes, icons, and loading states.',
                demo: buttonDemo
            },
            0
        )}
        {@render galleryCard(
            {
                slug: 'card',
                title: 'Card',
                desc: 'Content containers for panels, forms, and media.',
                demo: cardDemo
            },
            1
        )}
        {@render galleryCard(
            {
                slug: 'input',
                title: 'Input',
                desc: 'Labeled text fields with descriptions and validation.',
                demo: inputDemo
            },
            2
        )}
        {@render galleryCard(
            {
                slug: 'checkbox',
                title: 'Checkbox',
                desc: 'Binary and indeterminate toggles with labels.',
                demo: checkboxDemo
            },
            3
        )}
        {@render galleryCard(
            {
                slug: 'switch',
                title: 'Switch',
                desc: 'On/off toggles for settings and preferences.',
                demo: switchDemo
            },
            4
        )}
        {@render galleryCard(
            {
                slug: 'badge',
                title: 'Badge',
                desc: 'Status pills across ten semantic intents.',
                demo: badgeDemo
            },
            5
        )}
        {@render galleryCard(
            {
                slug: 'tabs',
                title: 'Tabs',
                desc: 'Switch between related panels, keyboard-navigable.',
                demo: tabsDemo
            },
            6
        )}
        {@render galleryCard(
            {
                slug: 'avatar',
                title: 'Avatar',
                desc: 'User images with graceful initials fallbacks.',
                demo: avatarDemo
            },
            7
        )}
        {@render galleryCard(
            {
                slug: 'alert',
                title: 'Alert',
                desc: 'Inline status banners for info, success, and errors.',
                demo: alertDemo
            },
            8
        )}
        {@render galleryCard(
            {
                slug: 'slider',
                title: 'Slider',
                desc: 'Drag to set a value within a range.',
                demo: sliderDemo
            },
            9
        )}
        {@render galleryCard(
            {
                slug: 'progress',
                title: 'Progress',
                desc: 'Determinate and indeterminate progress bars.',
                demo: progressDemo
            },
            10
        )}
        {@render galleryCard(
            {
                slug: 'toggle-group',
                title: 'Toggle Group',
                desc: 'Segmented single- or multi-select controls.',
                demo: toggleDemo
            },
            11
        )}
    </div>

    <div class="gallery__more">
        <Button href={resolve('/docs/components')} variant="outline">
            Browse all 54 components
            <ArrowRight size={15} />
        </Button>
    </div>
</section>

<style>
    .hero {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 1.5rem;
        width: 100%;
        max-width: 48rem;
        margin: 0 auto;
        padding: clamp(4rem, 16vh, 9rem) 1.5rem 4rem;
        text-align: center;
    }

    .hero__title {
        margin: 0;
        font-family: var(--font-header), sans-serif;
        font-weight: 600;
        font-size: clamp(2.25rem, 7vw, 3.75rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: var(--color-foreground);
    }

    .word {
        display: inline-block;
    }

    .hero__subtitle {
        margin: 0;
        max-width: 34rem;
        font-size: clamp(0.95rem, 2.4vw, 1.1rem);
        line-height: 1.6;
        color: var(--color-foreground-muted);
    }

    .hero__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    /* Grid lines — absolutely positioned within the home container. */
    .grid-lines {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
    }

    .gl {
        position: absolute;
        background: var(--color-border);
    }

    .gl--v {
        /* Extend up through the navbar to the very top so the side rails frame the
		   whole page. */
        top: -4rem;
        bottom: 0;
        width: 1px;
        transform-origin: top;
    }

    .gl--left {
        left: 0;
    }

    .gl--right {
        right: 0;
    }

    .gl--h {
        left: 0;
        right: 0;
        height: 1px;
        transform-origin: left;
    }

    .gl--top {
        top: 0;
    }

    .gl--bottom {
        bottom: 0;
    }

    .hero-rule {
        position: relative;
        z-index: 0;
        width: 100%;
        height: 1px;
        background: var(--color-border);
        transform-origin: left;
    }

    /* ── Gallery ──────────────────────────────────────────────────── */
    .gallery {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: none;
        margin: 0 auto;
        padding: clamp(2.5rem, 6vh, 4rem) 1.5rem clamp(5rem, 12vh, 7rem);
    }

    .gallery__grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .gallery__grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .gallery__grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    .gcard {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        background: var(--color-card);
        text-decoration: none;
        transition:
            transform var(--motion-duration-panel, 180ms) var(--ease-out),
            border-color var(--motion-duration-panel, 180ms) var(--ease-out),
            box-shadow var(--motion-duration-panel, 180ms) var(--ease-out);
    }

    .gcard:hover {
        border-color: var(--color-border-strong);
        box-shadow: var(--elevation-1);
    }

    .gcard:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring);
    }

    .gcard__preview {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 11rem;
        padding: 1.25rem;
        overflow: hidden;
        border-bottom: 1px solid var(--color-border);
        background: color-mix(in oklab, var(--color-foreground) 2.5%, var(--color-card));
    }

    /* Demos are decorative previews — the whole card is the link. */
    .gcard__demo {
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;
    }

    .gcard__meta {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.78rem;
        color: var(--color-foreground-muted);
    }

    .gcard__meta :global(.gcard__arrow) {
        color: color-mix(in srgb, var(--color-foreground-muted) 80%, transparent);
        transition:
            color var(--motion-duration-hover, 160ms) var(--ease-out),
            transform var(--motion-duration-hover, 160ms) var(--ease-out);
    }

    .gcard:hover .gcard__meta :global(.gcard__arrow) {
        color: var(--color-primary);
        transform: translate(1px, -1px);
    }

    .gcard__body {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 1.05rem 1.15rem 1.2rem;
    }

    .gcard__heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .gcard__title {
        font-family: var(--font-header), sans-serif;
        font-size: 0.96rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: var(--color-foreground);
    }

    .gcard__desc {
        margin: 0;
        font-size: 0.82rem;
        line-height: 1.5;
        color: var(--color-foreground-muted);
    }

    .gallery__more {
        display: flex;
        justify-content: center;
        margin-top: 2.5rem;
    }

    @media (prefers-reduced-motion: no-preference) {
        .word {
            animation: word-rise 0.4s var(--ease-out) calc(var(--i) * 0.03s) both;
        }

        .reveal {
            animation: reveal-rise 0.4s var(--ease-out) var(--d) both;
        }

        .gl--v {
            animation: draw-y 0.45s var(--ease-out) 0.22s both;
        }

        .gl--h,
        .hero-rule {
            animation: draw-x 0.4s var(--ease-out) var(--d, 0.34s) both;
        }
    }

    @keyframes word-rise {
        from {
            opacity: 0;
            transform: translateY(0.4em);
        }
    }

    @keyframes reveal-rise {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
    }

    @keyframes draw-y {
        from {
            transform: scaleY(0);
        }
    }

    @keyframes draw-x {
        from {
            transform: scaleX(0);
        }
    }
</style>
