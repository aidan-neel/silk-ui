<script lang="ts">
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';
	import Rectangle from './examples/rectangle.svelte';
	import RectangleSrc from './examples/rectangle.svelte?raw';
	import Circle from './examples/circle.svelte';
	import CircleSrc from './examples/circle.svelte?raw';
	import Card from './examples/card.svelte';
	import CardSrc from './examples/card.svelte?raw';

	const TITLE = 'Skeleton';

	const installCommand = 'bunx @sivir-ui/svelte add skeleton';
</script>

<svelte:head>
	<title>Sivir · {TITLE}</title>
	<meta name="description" content="Shimmering placeholder for loading content." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
	<!-- ─── Header ────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				{TITLE}
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A shimmering placeholder shown while content loads.
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
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">Import Skeleton and specify width and height:</p>
		<CodeBlock
			code={`import { Skeleton } from '$lib/sivir/components/skeleton';\n\n<Skeleton w={200} h={40} />\n<Skeleton w={100} h={100} class="rounded-full" />`}
			lang="svelte"
			copy="overlay"
		/>
	</section>

	<!-- ─── Examples ──────────────────────────────────────────────── -->
	<section id="examples" class="scroll-mt-20 flex flex-col gap-10">
		<div>
			<h2
				class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
			>
				Examples
			</h2>
			<p class="mt-2 text-sm text-foreground-muted">Skeleton in various shapes and sizes.</p>
		</div>

		<!-- Rectangle -->
		<div id="rectangle" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Rectangle
			</h3>
			<ComponentPreview code={RectangleSrc}>
				<Rectangle />
			</ComponentPreview>
		</div>

		<!-- Circle -->
		<div id="circle" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Circle
			</h3>
			<ComponentPreview code={CircleSrc}>
				<Circle />
			</ComponentPreview>
		</div>

		<!-- Card composition -->
		<div id="card" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Card composition
			</h3>
			<ComponentPreview code={CardSrc}>
				<Card />
			</ComponentPreview>
		</div>
	</section>
</div>
