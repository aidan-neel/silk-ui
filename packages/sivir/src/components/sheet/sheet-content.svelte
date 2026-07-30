<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { SheetContentProps } from '.';
	import { useOverlay } from '@sivir/ui/components/_internal/overlay';
	import { overlayIn, overlayOut, sheetIn, sheetOut } from '@sivir/ui/transition';
	import { getSheetContext } from './context.svelte';

	let {
		class: className,
		allowClickOutside = true,
		children,
		side = 'right',
		...rest
	}: SheetContentProps = $props();

	const { id, state: sheetState } = getSheetContext();
	let element = $state<HTMLElement>();
	let portalEl = $state<HTMLDivElement>();

	/**
	 * Portal to `<body>` so the sheet escapes ancestor stacking contexts, the same
	 * pattern Modal uses, and the slide always paints over the page.
	 */
	$effect(() => {
		if (!portalEl || typeof document === 'undefined') return;
		document.body.appendChild(portalEl);
		return () => {
			portalEl?.remove();
		};
	});

	/** Shared overlay behavior: focus trap, click-outside, Escape, body lock. */
	useOverlay({
		isOpen: () => sheetState.open,
		panelEl: () => element,
		onClose: () => {
			sheetState.open = false;
		},
		allowClickOutside: () => allowClickOutside,
		returnFocus: () => sheetState.triggerRef ?? undefined
	});
</script>

{#if sheetState.open}
	<div
		bind:this={portalEl}
		data-overlay-root
		class="pointer-events-none fixed inset-0 z-40 [&>*]:pointer-events-auto"
	>
		<div
			in:overlayIn
			out:overlayOut
			data-ui="sheet-overlay"
			class={cn(
				// token-lint-disable-next-line no-literal-length
				'absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] [backface-visibility:hidden] [transform:translateZ(0)]'
			)}
			aria-hidden="true"
		></div>
		<div
			bind:this={element}
			data-ui="sheet-content"
			data-side={side}
			data-motion="sheet"
			in:sheetIn={{ side }}
			out:sheetOut={{ side }}
			class={cn(
				className,
				// token-lint-disable-next-line no-literal-length
				`fixed top-2 bottom-2 z-50 flex w-[calc(100%-1rem)] max-w-sm flex-col overflow-hidden text-foreground shadow-[var(--elevation-float)] will-change-transform [backface-visibility:hidden] ${
					side === 'left' ? 'left-2' : 'right-2'
				}`,
				'rounded-[var(--radius-lg)] border border-border bg-panel'
			)}
			role="dialog"
			aria-modal="true"
			id={`sheet-${id}`}
			aria-labelledby={id + '-title'}
			aria-describedby={id + '-desc'}
			tabindex="-1"
			{...rest}
		>
			<!-- Inset surface: the sheet body lives here, on the panel fill. -->
			<div
				class={cn('flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-panel p-4')}
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
