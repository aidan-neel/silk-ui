<script lang="ts">
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';
	import Single from './examples/single.svelte';
	import SingleSrc from './examples/single.svelte?raw';
	import MultiLanguage from './examples/multi-language.svelte';
	import MultiLanguageSrc from './examples/multi-language.svelte?raw';
	import LineNumbers from './examples/line-numbers.svelte';
	import LineNumbersSrc from './examples/line-numbers.svelte?raw';
	import Compound from './examples/compound.svelte';
	import CompoundSrc from './examples/compound.svelte?raw';
	import CustomActions from './examples/custom-actions.svelte';
	import CustomActionsSrc from './examples/custom-actions.svelte?raw';
	import CopyOverlay from './examples/copy-overlay.svelte';
	import CopyOverlaySrc from './examples/copy-overlay.svelte?raw';
	import CopyInline from './examples/copy-inline.svelte';
	import CopyInlineSrc from './examples/copy-inline.svelte?raw';

	const installCommand = 'bunx @sivir-ui/svelte add code-block';

	const usageSnippet = `import { CodeBlock } from '$lib/sivir/components/code-block';

<CodeBlock
  value="javascript"
  tabs={[
    { label: 'Python',     lang: 'python',     code: pyCode },
    { label: 'JavaScript', lang: 'javascript', code: jsCode },
  ]}
/>`;
</script>

<svelte:head>
	<title>Sivir · Code Block</title>
	<meta
		name="description"
		content="Syntax-highlighted code block with a multi-language tab switcher, copy button, and an actions slot. Highlighting via highlight.js."
	/>
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
	<!-- ─── Header ────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Code Block
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A code viewer with syntax highlighting, a language switcher, and a copy button.
			</p>
		</div>
	</header>

	<!-- ─── Hero Example ──────────────────────────────────────────── -->
	<section id="hero" class="scroll-mt-20 flex flex-col gap-4">
		<ComponentPreview code={HeroSrc}>
			<Hero />
		</ComponentPreview>
	</section>

	<!-- ─── Installation ──────────────────────────────────────────── -->
	<section id="installation" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Installation
		</h2>
		<InstallCommand command={installCommand} />
		<p class="text-sm text-foreground-muted">
			The component depends on <code class="font-mono text-foreground">highlight.js</code>. Install
			it if your project doesn't have it yet:
		</p>
		<InstallCommand command="bun add highlight.js" />
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">
			Pass a <code class="font-mono text-foreground">tabs</code> array for the multi-language form,
			or
			<code class="font-mono text-foreground">code</code> +
			<code class="font-mono text-foreground">lang</code> for a single snippet:
		</p>
		<CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
	</section>

	<!-- ─── Examples ──────────────────────────────────────────────── -->
	<section id="examples" class="scroll-mt-20 flex flex-col gap-10">
		<div>
			<h2
				class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
			>
				Examples
			</h2>
			<p class="mt-2 text-sm text-foreground-muted">
				From a single highlighted snippet to fully composed, multi-language blocks.
			</p>
		</div>

		<div id="single" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Single snippet
			</h3>
			<ComponentPreview code={SingleSrc}>
				<Single />
			</ComponentPreview>
		</div>

		<div id="multi-language" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Multiple languages
			</h3>
			<ComponentPreview code={MultiLanguageSrc}>
				<MultiLanguage />
			</ComponentPreview>
		</div>

		<div id="line-numbers" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Line numbers
			</h3>
			<ComponentPreview code={LineNumbersSrc}>
				<LineNumbers />
			</ComponentPreview>
		</div>

		<div id="custom-actions" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Custom actions
			</h3>
			<ComponentPreview code={CustomActionsSrc}>
				<CustomActions />
			</ComponentPreview>
		</div>

		<div id="copy-overlay" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Copy placement: overlay
			</h3>
			<ComponentPreview code={CopyOverlaySrc}>
				<CopyOverlay />
			</ComponentPreview>
		</div>

		<div id="copy-inline" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Copy placement: inline
			</h3>
			<ComponentPreview code={CopyInlineSrc}>
				<CopyInline />
			</ComponentPreview>
		</div>

		<div id="compound" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Compound API
			</h3>
			<ComponentPreview code={CompoundSrc}>
				<Compound />
			</ComponentPreview>
		</div>
	</section>
</div>
