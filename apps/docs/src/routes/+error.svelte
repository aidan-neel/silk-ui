<script lang="ts">
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
</script>

<svelte:head>
    <title>{page.status} · Sivir UI</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<section
    class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-start gap-6 px-6 pt-[clamp(7rem,18vh,12rem)] text-center"
>
    <div class="flex flex-col items-center gap-3">
        <p class="m-0 font-mono text-sm tabular-nums text-foreground-muted">{page.status}</p>
        <h1 class="m-0 text-balance text-4xl font-semibold tracking-tight text-foreground">
            {page.status === 404 ? 'Page not found' : 'Something went wrong'}
        </h1>
        <p class="m-0 max-w-lg text-pretty leading-relaxed text-foreground-muted">
            {page.status === 404
                ? 'The page may have moved, or the address may be incomplete.'
                : 'The request could not be completed. Try again, or return to the documentation.'}
        </p>
    </div>
    <div class="flex flex-wrap justify-center gap-3">
        <Button href={resolve('/docs/introduction')}><ArrowLeft size={16} />Back to docs</Button>
        <Button href={resolve('/')} variant="outline">Home</Button>
    </div>
</section>
