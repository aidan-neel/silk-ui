<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Destructive from './examples/destructive.svelte';
    import DestructiveSrc from './examples/destructive.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import SignOut from './examples/sign-out.svelte';
    import SignOutSrc from './examples/sign-out.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add alert-dialog';
</script>

<svelte:head>
    <title>Sivir · Alert Dialog</title>
    <meta
        name="description"
        content="A modal that interrupts the user to confirm a consequential action."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Alert Dialog </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A modal dialog that interrupts to confirm an action. Use it for destructive or
                irreversible choices.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Import the AlertDialog components and use them:
        </Typography.Text>
        <CodeBlock
            code={`import * as AlertDialog from '$lib/sivir/components/alert-dialog';\nimport Shortcut from '$lib/sivir/components/shortcut';\n\n<AlertDialog.Root orientation="vertical">\n  <AlertDialog.Trigger>Delete</AlertDialog.Trigger>\n  <AlertDialog.Content size="lg">\n    <AlertDialog.Header>\n      <AlertDialog.Title>Delete?</AlertDialog.Title>\n      <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>\n    </AlertDialog.Header>\n    <AlertDialog.Footer>\n      <AlertDialog.Exit>Cancel <Shortcut shortcut="esc" /></AlertDialog.Exit>\n      <AlertDialog.Confirm>Delete <Shortcut shortcut="enter" /></AlertDialog.Confirm>\n    </AlertDialog.Footer>\n  </AlertDialog.Content>\n</AlertDialog.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Common patterns for destructive actions and sign-out flows.
            </Typography.Text>
        </div>

        <!-- Destructive confirmation -->
        <div id="destructive" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">
                Destructive confirmation
            </Typography.H3>
            <ComponentPreview code={DestructiveSrc}>
                <Destructive />
            </ComponentPreview>
        </div>

        <!-- Sign out -->
        <div id="sign-out" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sign out confirmation </Typography.H3>
            <ComponentPreview code={SignOutSrc}>
                <SignOut />
            </ComponentPreview>
        </div>
    </section>
</div>
