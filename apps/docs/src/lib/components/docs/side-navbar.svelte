<script lang="ts">
	import { page } from '$app/stores';
	import { components, sanitizeComponent } from '$lib/components';
	import { Button } from '@sivir-ui/svelte/components/button';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Download from '@lucide/svelte/icons/download';
	import Palette from '@lucide/svelte/icons/palette';
	import Component from '@lucide/svelte/icons/component';

	let { class: classProp = '', onNavigate }: { class?: string; onNavigate?: () => void } = $props();
	const pageName = $derived($page.url.pathname);

	const gettingStartedItems = [
		{ href: '/docs/introduction', label: 'Introduction', icon: BookOpen },
		{ href: '/docs/installation', label: 'Installation', icon: Download },
		{ href: '/docs/theming', label: 'Theming', icon: Palette },
		{ href: '/docs/components', label: 'Components', icon: Component }
	];

	function isActive(path: string) {
		return pageName === path;
	}
</script>

<aside
	class={`${classProp} sivir-docs-sidebar hide-scrollbar-all flex flex-col gap-5 overflow-y-auto pb-8 pr-4`}
>
	<section class="flex flex-col gap-1.5">
		<h3
			class="px-2 text-[12px] text-foreground-muted [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
		>
			Getting Started
		</h3>
		<div class="flex flex-col gap-0.5">
			{#each gettingStartedItems as item (item.href)}
				{@const active = isActive(item.href)}
				<Button
					variant="ghost"
					href={item.href}
					onclick={onNavigate}
					class={`h-8 w-fit justify-start gap-2 rounded-lg px-3 text-left text-sm transition-[background-color,color] ${
						active
							? 'bg-secondary/85 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]'
							: 'hover:bg-secondary hover:text-foreground'
					}`}
				>
					<item.icon size={14} />
					{item.label}
				</Button>
			{/each}
		</div>
	</section>

	<section class="flex flex-col gap-1.5">
		<div class="flex items-center justify-between px-2">
			<h3
				class="text-[12px] text-foreground-muted [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
			>
				Components
			</h3>
			<span class="text-[11px] text-foreground-muted/70">{components.length}</span>
		</div>
		<div class="flex flex-col gap-0.5">
			{#each components as component (component)}
				{@const active = pageName === `/docs/components/${component}`}
				<Button
					variant="ghost"
					href={`/docs/components/${component}`}
					onclick={onNavigate}
					class={`h-8.5 w-fit justify-start rounded-lg px-3 text-left text-sm transition-[background-color,color] ${
						active
							? 'bg-secondary/85 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]'
							: 'hover:bg-secondary hover:text-foreground'
					}`}
				>
					{sanitizeComponent(component)}
				</Button>
			{/each}
		</div>
	</section>
</aside>

<style>
	.sivir-docs-sidebar {
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, var(--color-foreground) 18%, transparent) transparent;
		overscroll-behavior: contain;
	}
	.sivir-docs-sidebar::-webkit-scrollbar {
		width: 8px;
	}
	.sivir-docs-sidebar::-webkit-scrollbar-track {
		background: transparent;
	}
	.sivir-docs-sidebar::-webkit-scrollbar-thumb {
		background: color-mix(in srgb, var(--color-foreground) 14%, transparent);
		border: 2px solid transparent;
		background-clip: padding-box;
		border-radius: 9999px;
	}
	.sivir-docs-sidebar:hover::-webkit-scrollbar-thumb {
		background: color-mix(in srgb, var(--color-foreground) 26%, transparent);
		background-clip: padding-box;
	}
</style>
