<script lang="ts">
	import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
	import { themeToCss, type Theme } from '@sivir-ui/svelte/themes/theme';
	import { Button } from '@sivir-ui/svelte/components/button';
	import { Input } from '@sivir-ui/svelte/components/input';
	import { toast } from '@sivir-ui/svelte/components/toast';
	import { applyLiveThemeCss } from '@sivir-ui/svelte/themes/live';
	import type { PageData } from './$types';

	import Search from '@lucide/svelte/icons/search';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import FileCode from '@lucide/svelte/icons/file-code';
	import Braces from '@lucide/svelte/icons/braces';

	const { data = { themes: builtInThemePresets } as PageData }: { data?: PageData } = $props();
	const getInitialThemes = () => {
		const builtInSlugs = new Set(builtInThemePresets.map((theme) => theme.slug));
		const registryThemes = Array.isArray(data?.themes) ? data.themes : [];
		return [
			...builtInThemePresets,
			...registryThemes.filter((theme) => !builtInSlugs.has(theme.slug))
		];
	};

	let searchQuery = $state('');
	let themes = $state<Theme[]>(getInitialThemes());

	const filteredThemes = $derived.by(() => {
		const needle = searchQuery.trim().toLowerCase();
		return themes.filter((theme) => {
			if (!needle) return true;
			const haystack = [theme.name, theme.description, theme.publisher ?? '']
				.join(' ')
				.toLowerCase();
			return haystack.includes(needle);
		});
	});

	function applyTheme(theme: Theme) {
		applyLiveThemeCss(themeToCss(theme));
		toast({
			title: `${theme.name} applied`,
			description: 'Live tokens updated across the app.',
			duration: 2000,
			type: 'success'
		});
	}

	// Theme detail modal
	let detailOpen = $state(false);
	let detailTheme = $state<Theme | null>(null);
	let copiedKey = $state<'css' | 'json' | null>(null);

	function openDetail(theme: Theme) {
		detailTheme = theme;
		copiedKey = null;
		detailOpen = true;
	}

	function copyValue(value: string, key: 'css' | 'json', label: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(value);
		copiedKey = key;
		toast({
			title: `${label} copied`,
			description: 'Paste it wherever you like.',
			duration: 1600,
			type: 'success'
		});
		setTimeout(() => {
			if (copiedKey === key) copiedKey = null;
		}, 1600);
	}

	const detailCss = $derived(detailTheme ? themeToCss(detailTheme) : '');
	const detailJson = $derived(detailTheme ? JSON.stringify(detailTheme, null, 2) : '');
</script>

<svelte:head>
	<title>Sivir · Themes</title>
	<meta name="description" content="Explore and customize Sivir themes." />
</svelte:head>

<div class="mt-16 min-h-[calc(100vh-4rem)] bg-background">
	<!-- Hero -->
	<section class="border-b border-border/60">
		<div class="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-14 md:px-8 md:py-20">
			<div class="mx-auto flex w-full max-w-[44rem] flex-col items-center gap-3 text-center">
				<h1
					class="m-0 text-[2.9rem] font-[500] leading-[1.05] tracking-tight md:text-[3.6rem]"
					style="font-family: var(--font-header);"
				>
					Sivir themes.
				</h1>
				<p class="m-0 max-w-[42rem] text-[0.95rem] leading-relaxed text-foreground-muted">
					Explore a complete theme preset, apply it live, and copy CSS or JSON into your project.
				</p>
			</div>

			<div class="mx-auto w-full max-w-[44rem]">
				<div class="relative">
					<Search
						size={14}
						class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-foreground-muted"
					/>
					<Input
						variant="outline"
						class="pl-9"
						placeholder="Search themes…"
						bind:value={searchQuery}
					/>
				</div>
			</div>

			{#if true}
				<div
					class="mx-auto flex w-full max-w-[44rem] flex-wrap items-center justify-center gap-3 text-[0.78rem] text-foreground-muted"
				>
					<span>
						<span class="font-[600] text-foreground">{themes.length}</span>
						{themes.length === 1 ? 'theme' : 'themes'} available
					</span>
					{#if searchQuery.trim()}
						<span aria-hidden="true">·</span>
						<span>
							<span class="font-[600] text-foreground">{filteredThemes.length}</span>
							matching
						</span>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<!-- Grid -->
	<section class="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
		{#if filteredThemes.length === 0}
			<div
				class="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border/80 bg-card/40 px-6 py-14 text-center"
			>
				{#if true}
					<div class="flex flex-col gap-1">
						<p class="m-0 text-[1rem] font-[500] text-foreground">No themes found</p>
						<p class="m-0 text-[0.84rem] text-foreground-muted">
							Try a different keyword, or clear the search to see every theme.
						</p>
					</div>
				{/if}
				{#if searchQuery.trim()}
					<Button variant="ghost" size="sm" onclick={() => (searchQuery = '')}>Clear search</Button>
				{/if}
			</div>
		{:else}
			<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredThemes as theme (theme.slug)}
					<li class="overflow-hidden rounded-[var(--radius-lg)]">
						<div
							class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-colors hover:border-border/80"
							onclick={() => openDetail(theme)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									openDetail(theme);
								}
							}}
							role="button"
							tabindex="0"
						>
							<!-- Header -->
							<div class="flex flex-col gap-2 border-b border-border/60 px-4 py-3">
								<h3
									class="m-0 text-[1rem] font-[500] text-foreground"
									style="font-family: var(--font-header);"
								>
									{theme.name}
								</h3>
								<p class="m-0 text-[0.82rem] leading-relaxed text-foreground-muted line-clamp-2">
									{theme.description}
								</p>
							</div>

							<!-- Info -->
							<div class="flex-1 px-4 py-3 text-[0.78rem] text-foreground-muted space-y-1">
								<div><span class="text-foreground">Brand:</span> {theme.brand}</div>
								<div><span class="text-foreground">Neutral:</span> {theme.neutral}</div>
								<div><span class="text-foreground">Radius:</span> {theme.radius}</div>
								<div><span class="text-foreground">Motion:</span> {theme.motion}</div>
								<div><span class="text-foreground">Fonts:</span> {theme.fontSans}</div>
							</div>

							<!-- Actions -->
							<div
								class="mt-auto flex items-center justify-end gap-2 border-t border-border/60 px-3 py-2.5"
								onclick={(e) => e.stopPropagation()}
								onkeydown={(e) => e.stopPropagation()}
								role="presentation"
							>
								<Button
									variant="ghost"
									size="sm"
									class="h-8 text-[0.78rem]"
									onclick={() => applyTheme(theme)}
								>
									Apply
								</Button>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<!-- Detail Modal -->
	{#if detailTheme}
		<div
			class={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${detailOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
			style={`background: rgba(0, 0, 0, ${detailOpen ? '0.5' : '0'})`}
			onclick={() => (detailOpen = false)}
			onkeydown={(e) => {
				if (e.key === 'Escape') detailOpen = false;
			}}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div
				class="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-[var(--radius-lg)] border border-border bg-background p-6"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="presentation"
			>
				<div class="flex items-center justify-between gap-3 mb-4">
					<h2
						class="m-0 text-[1.5rem] font-[600] text-foreground"
						style="font-family: var(--font-header);"
					>
						{detailTheme.name}
					</h2>
					<button
						type="button"
						class="text-foreground-muted hover:text-foreground transition-colors"
						onclick={() => (detailOpen = false)}
						aria-label="Close"
					>
						<X size={20} />
					</button>
				</div>

				<p class="m-0 mb-6 text-[0.92rem] leading-relaxed text-foreground-muted">
					{detailTheme.description}
				</p>

				<!-- Theme metadata -->
				<div class="mb-6 grid grid-cols-2 gap-3 text-[0.82rem]">
					<div>
						<span class="text-foreground-muted">Brand</span>
						<div class="flex items-center gap-2 mt-1">
							<span class="size-4 rounded" style={`background: ${detailTheme.brand}`}></span>
							<code class="text-foreground-muted font-mono text-[0.75rem]">{detailTheme.brand}</code
							>
						</div>
					</div>
					<div>
						<span class="text-foreground-muted">Neutral</span>
						<p class="m-0 mt-1 text-foreground">{detailTheme.neutral}</p>
					</div>
					<div>
						<span class="text-foreground-muted">Radius</span>
						<p class="m-0 mt-1 text-foreground">{detailTheme.radius}</p>
					</div>
					<div>
						<span class="text-foreground-muted">Motion</span>
						<p class="m-0 mt-1 text-foreground">{detailTheme.motion}</p>
					</div>
					<div>
						<span class="text-foreground-muted">Fonts</span>
						<p class="m-0 mt-1 text-foreground text-[0.75rem]">
							{detailTheme.fontSans} / {detailTheme.fontMono}
						</p>
					</div>
				</div>

				<!-- Export -->
				<div class="border-t border-border/60 pt-4 mb-4">
					<p class="m-0 text-[0.78rem] font-[600] text-foreground-muted mb-3">Export</p>
					<div class="flex flex-col gap-2">
						<Button
							variant="ghost"
							class="justify-start gap-2"
							onclick={() => copyValue(detailCss, 'css', 'CSS')}
						>
							{#if copiedKey === 'css'}
								<Check size={14} class="text-[var(--color-success)]" />
								Copied CSS
							{:else}
								<FileCode size={14} />
								Copy CSS
							{/if}
						</Button>
						<Button
							variant="ghost"
							class="justify-start gap-2"
							onclick={() => copyValue(detailJson, 'json', 'JSON')}
						>
							{#if copiedKey === 'json'}
								<Check size={14} class="text-[var(--color-success)]" />
								Copied JSON
							{:else}
								<Braces size={14} />
								Copy JSON
							{/if}
						</Button>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-end gap-2">
					<Button variant="outline" size="sm" onclick={() => (detailOpen = false)}>Close</Button>
					<Button size="sm" onclick={() => applyTheme(detailTheme!)}>
						<Sparkles size={14} />
						Apply theme
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
