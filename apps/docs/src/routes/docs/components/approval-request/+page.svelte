<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import RiskLevels from './examples/risk-levels.svelte';
    import RiskLevelsSrc from './examples/risk-levels.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add approval-request';
</script>

<svelte:head>
    <title>Sivir · Approval Request</title>
    <meta name="description" content="A modal approval prompt for consequential agent actions." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Approval Request
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] leading-relaxed font-[var(--font-weight-description,450)] text-foreground-muted"
            >
                Ask for a clear decision before an agent performs a consequential action.
            </p>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Installation
        </h2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Usage
        </h2>
        <p class="text-sm text-foreground-muted">
            Control visibility with <code>bind:open</code>. <code>Cancel</code> and
            <code>Confirm</code>
            close the modal and fire their <code>onclick</code> callbacks. Use verb-first labels
            that name the exact action.
        </p>
        <CodeBlock
            code={`import * as ApprovalRequest from '@sivir-ui/svelte/components/approval-request';

let open = $state(false);

<Button onclick={() => (open = true)}>Restart worker</Button>
<ApprovalRequest.Root bind:open risk="medium">
  <ApprovalRequest.Content>
    <ApprovalRequest.Header>
      <ApprovalRequest.Status>
        <ApprovalRequest.Icon />
        <ApprovalRequest.Risk />
      </ApprovalRequest.Status>
      <ApprovalRequest.Title>Restart the production worker?</ApprovalRequest.Title>
      <ApprovalRequest.Description>
        Active jobs may retry on another worker.
      </ApprovalRequest.Description>
    </ApprovalRequest.Header>
    <ApprovalRequest.Footer>
      <ApprovalRequest.Cancel>Keep running</ApprovalRequest.Cancel>
      <ApprovalRequest.Confirm onclick={() => restartWorker()}>
        Restart worker
      </ApprovalRequest.Confirm>
    </ApprovalRequest.Footer>
  </ApprovalRequest.Content>
</ApprovalRequest.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">
                Match risk to impact. High-risk requests use destructive badge and confirmation
                styling.
            </p>
        </div>

        <div id="risk-levels" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Risk levels
            </h3>
            <ComponentPreview code={RiskLevelsSrc}><RiskLevels /></ComponentPreview>
        </div>
    </section>
</div>
