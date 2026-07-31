<script lang="ts">
	import { resolve } from '$app/paths';
	import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

	const packageInstall = `bun add @sivir-ui/svelte
# npm i @sivir-ui/svelte
# pnpm add @sivir-ui/svelte`;

	const packageCss = `@import '@sivir-ui/svelte/ui.css';`;

	const packageUse = `<script>
  import { Button } from '@sivir-ui/svelte';
<${'/'}script>

<Button>Get started</Button>`;

	const cliCss = `/* src/app.css */
@import './lib/sivir/ui.css';`;

	const cliAdd = `bunx --package @sivir-ui/svelte sivir add button
bunx --package @sivir-ui/svelte sivir list`;

	const cliUse = `<script>
  import { Button } from '$lib/sivir/components/button';
<${'/'}script>

<Button>Get started</Button>`;
</script>

<svelte:head>
	<title>Sivir · Installation</title>
	<meta name="description" content="Install Sivir UI with the npm package or the sivir CLI." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Installation
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				Install Sivir UI into your project.
			</p>
		</div>
	</header>

	<section id="prerequisites" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Prerequisites
		</h2>
		<ul
			class="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[1rem] text-foreground leading-relaxed"
		>
			<li>Svelte 5 or SvelteKit</li>
			<li>Tailwind CSS v4</li>
		</ul>
	</section>

	<section id="package-import" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Option A: Package import
		</h2>
		<p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
			Install the library and import components from
			<code class="font-mono">@sivir-ui/svelte</code>.
		</p>
		<CodeBlock code={packageInstall} lang="shell" copy="overlay" />
		<p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
			Import the stylesheet once (for example in
			<code class="font-mono">src/app.css</code>):
		</p>
		<CodeBlock code={packageCss} lang="css" copy="overlay" />
		<p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">Use a component:</p>
		<CodeBlock code={packageUse} lang="svelte" copy="overlay" />
		<p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
			Compound components use a namespace export (for example
			<code class="font-mono">Modal</code> with
			<code class="font-mono">Modal.Root</code>,
			<code class="font-mono">Modal.Content</code>, …).
		</p>
	</section>

	<section id="cli-source-copy" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Option B: CLI source copy
		</h2>
		<p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
			The CLI copies source into your project. The package name is
			<code class="font-mono">@sivir-ui/svelte</code>; the binary is
			<code class="font-mono">sivir</code>.
		</p>

		<h3
			class="m-0 text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
		>
			1. Create a project (optional)
		</h3>
		<CodeBlock code="bunx sv create my-app" lang="shell" copy="overlay" />

		<h3
			class="m-0 text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
		>
			2. Add Tailwind v4
		</h3>
		<CodeBlock code="cd my-app && bunx sv add tailwindcss" lang="shell" copy="overlay" />

		<h3
			class="m-0 text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
		>
			3. Initialize Sivir
		</h3>
		<p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
			Creates <code class="font-mono">src/lib/sivir/</code> (tokens + utilities) and
			<code class="font-mono">sivir.json</code>.
		</p>
		<CodeBlock code="bunx --package @sivir-ui/svelte sivir init -y" lang="shell" copy="overlay" />

		<h3
			class="m-0 text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
		>
			4. Import the stylesheet
		</h3>
		<CodeBlock code={cliCss} lang="css" copy="overlay" />

		<h3
			class="m-0 text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
		>
			5. Add components
		</h3>
		<CodeBlock code={cliAdd} lang="shell" copy="overlay" />

		<h3
			class="m-0 text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
		>
			6. Use them
		</h3>
		<CodeBlock code={cliUse} lang="svelte" copy="overlay" />
	</section>

	<section id="notes" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Notes
		</h2>
		<ul
			class="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[1rem] text-foreground leading-relaxed"
		>
			<li>
				Tailwind v3 is not supported. Sivir needs v4
				<code class="font-mono">@theme</code> and
				<code class="font-mono">color-mix</code>.
			</li>
			<li>
				Dark mode uses a <code class="font-mono">.dark</code> class on
				<code class="font-mono">&lt;html&gt;</code>.
			</li>
			<li>
				Built-in theme presets install with
				<code class="font-mono">bunx --package @sivir-ui/svelte sivir add theme &lt;slug&gt;</code>
				(for example <code class="font-mono">default</code>).
			</li>
		</ul>
	</section>

	<section id="next" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Next
		</h2>
		<p class="m-0 text-[1rem] text-foreground leading-relaxed">
			<a class="text-foreground underline underline-offset-2" href={resolve('/docs/theming')}
				>Theming</a
			>
			·
			<a class="text-foreground underline underline-offset-2" href={resolve('/docs/components')}
				>Components</a
			>
		</p>
	</section>
</div>
