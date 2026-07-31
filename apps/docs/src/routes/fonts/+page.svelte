<script lang="ts">
	import { DEFAULT_FONT, fonts, selectedFont } from '$lib/fonts.svelte';
</script>

<svelte:head>
	<title>Sivir · Fonts</title>
	<meta name="description" content="Set the typeface for the current Sivir theme." />
</svelte:head>

<div class="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-6 md:py-16">
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Fonts
			</h1>
			<p
				class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
			>
				Set the typeface for the current theme. Your choice is saved and follows you across the rest
				of Sivir.
			</p>
		</div>
	</header>

	<div class="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
		{#each fonts as font (font.name)}
			<button
				onclick={() => (selectedFont.current = font.name)}
				aria-pressed={selectedFont.current === font.name}
				class={`min-h-40 rounded-[var(--radius-lg)] border p-5 text-left transition-colors focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] ${selectedFont.current === font.name ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-foreground-muted'}`}
			>
				<span class="text-xs text-foreground-muted"
					>{font.category}{font.name === DEFAULT_FONT ? ' · default' : ''}</span
				>
				<span class="mt-6 block text-3xl leading-none" style:font-family={font.family}>Ag</span>
				<span class="mt-3 block text-sm font-medium">{font.name}</span>
			</button>
		{/each}
	</div>
</div>
