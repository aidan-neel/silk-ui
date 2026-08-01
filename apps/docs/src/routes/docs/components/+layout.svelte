<script lang="ts">
	import { page } from '$app/state';
	import { componentAnatomy, type ComponentSlug } from '$lib/component-anatomy';
	import { Anatomy } from '$lib/components/docs';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
	const slug = $derived(page.url.pathname.split('/').at(-1) as ComponentSlug);
	const anatomy = $derived(componentAnatomy[slug]);
</script>

{@render children?.()}

{#if anatomy}
	<Anatomy items={anatomy} />
{/if}
