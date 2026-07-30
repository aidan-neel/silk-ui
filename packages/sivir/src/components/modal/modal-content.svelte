<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { ModalContentProps } from '.';
	import { dialogIn, dialogOut, overlayIn, overlayOut } from '@sivir/ui/transition';
	import { useOverlay } from '@sivir/ui/components/_internal/overlay';
	import X from '@lucide/svelte/icons/x';
	import { getModalContext } from './context.svelte';

	let {
		class: className,
		allowClickOutside = true,
		role = 'dialog',
		contentClass = '',
		overlayClass = '',
		surfaceClass = '',
		panelIdPrefix = 'modal',
		showClose = true,
		size = 'md',
		children,
		...rest
	}: ModalContentProps = $props();

	const maxWidthClass = $derived(
		(
			{
				sm: 'max-w-[18rem]',
				md: 'max-w-xs',
				lg: 'max-w-md',
				xl: 'max-w-xl'
			} as const
		)[size]
	);

	const modal = getModalContext();
	const contentId = $derived(`${panelIdPrefix}-${modal.id}`);
	let element = $state<HTMLElement>();
	let portalEl = $state<HTMLDivElement>();

	$effect(() => {
		modal.contentId = contentId;
	});

	/**
	 * Portal the modal to `<body>` so its z-index escapes ancestor stacking
	 * contexts such as flex items with a z-index or transformed parents.
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
		isOpen: () => modal.state.open,
		panelEl: () => element,
		onClose: () => {
			modal.state.open = false;
		},
		allowClickOutside: () => allowClickOutside,
		returnFocus: () => modal.returnFocusEl
	});
</script>

{#if modal.state.open}
	<div bind:this={portalEl} data-overlay-root class="fixed inset-0 z-[115]">
		<div
			in:overlayIn
			out:overlayOut
			data-ui="modal-overlay"
			class={cn(
				overlayClass, // token-lint-disable-next-line no-literal-length
				'absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] [backface-visibility:hidden] [transform:translateZ(0)]'
			)}
		></div>
		<div
			in:dialogIn
			out:dialogOut
			bind:this={element}
			data-motion="dialog"
			class={cn(
				contentClass,
				className, // token-lint-disable-next-line no-literal-length
				'origin-center bg-panel text-foreground shadow-[var(--elevation-float)]',
				'rounded-[var(--radius-lg)] border border-border',
				'fixed top-[45%] left-1/2 z-[120] m-auto min-h-20 w-[calc(100%-3rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain md:w-full max-h-[calc(100dvh-2rem)]', // token-lint-disable-line no-literal-length
				maxWidthClass
			)}
			{role}
			aria-modal="true"
			id={contentId}
			aria-labelledby={modal.id + '-title'}
			aria-describedby={modal.id + '-desc'}
			tabindex="-1"
			{...rest}
		>
			<!-- Experiment: Modal.Content as a Panel. The box is Panel's outer frame;
			     this is its inset surface, themed with the modal's own tokens. -->
			<div class={cn(surfaceClass, 'bg-panel', 'relative flex h-full flex-col gap-4 p-5')}>
				{#if showClose}
					<button
						onclick={() => {
							modal.state.open = false;
						}}
						aria-label="Close"
						class="absolute top-2.5 right-2.5 inline-flex size-7 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
					>
						<X size={16} />
					</button>
				{/if}
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
