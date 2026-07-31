<script lang="ts">
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { cn } from '@sivir-ui/svelte/utils';

	let {
		size = 16,
		class: classProp,
		'aria-label': ariaLabel,
		'aria-hidden': ariaHidden
	}: {
		size?: number;
		class?: string;
		'aria-label'?: string;
		'aria-hidden'?: boolean | 'true' | 'false';
	} = $props();
</script>

<LoaderCircle
	data-ui="spinner"
	{size}
	aria-label={ariaLabel}
	aria-hidden={ariaHidden}
	class={cn(classProp, 'shrink-0 animate-spin motion-reduce:animate-none')}
/>
