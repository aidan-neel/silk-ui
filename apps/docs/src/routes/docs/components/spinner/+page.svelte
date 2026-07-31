<script lang="ts">
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';

	const installCommand = 'bunx @sivir-ui/svelte add spinner';
</script>

<svelte:head>
	<title>Sivir · Spinner</title>
	<meta name="description" content="An animated loading indicator for indeterminate work." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Spinner
			</h1>
			<p
				class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
			>
				A compact loading indicator with a paced rotation that keeps indeterminate work feeling
				active.
			</p>
		</div>
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
			Use Spinner for work with an unknown duration. Set <code>aria-hidden</code> when adjacent text already
			describes the loading state.
		</p>
		<CodeBlock
			code={`import { Spinner } from '@sivir-ui/svelte/components/spinner';\n\n<Spinner aria-hidden="true" />`}
			lang="svelte"
			copy="overlay"
		/>
	</section>
</div>
