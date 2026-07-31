<!-- token-lint-disable-file -->
<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { cn } from '@sivir-ui/svelte/utils';
	import { getColorPickerContext } from './context';
	import { isValidHex } from './conversions';

	type Props = {
		/** Trigger style -- matches Button variants. Defaults to outlined. */
		variant?: 'outline' | 'secondary' | 'ghost';
		class?: string;
	};

	let { variant = 'outline', class: className }: Props = $props();

	const ctx = getColorPickerContext();
	const selectedLabel = $derived(
		ctx.options.find((o) => o.value.toLowerCase() === (ctx.value ?? '').toLowerCase())?.label ??
			null
	);
</script>

<Popover.Trigger
	{variant}
	class={cn(className, 'group w-full justify-start gap-1.5 pl-1.5 pr-2.5')}
>
	<span
		class="size-5 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
		style:background={isValidHex(ctx.value) ? ctx.value : '#888888'}
	></span>
	<span class="min-w-0 flex-1 truncate text-left font-mono text-[0.78rem] text-foreground">
		{selectedLabel ?? ctx.value}
	</span>
</Popover.Trigger>
