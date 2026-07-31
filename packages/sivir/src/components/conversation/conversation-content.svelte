<script lang="ts">
	import { cn } from '@sivir-ui/svelte/utils';
	import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
	import { untrack } from 'svelte';
	import type { ConversationContentProps } from '.';
	import { getConversationContext } from './context.svelte';

	let {
		children,
		class: className,
		'aria-label': ariaLabel = 'Conversation',
		tabindex,
		onscroll,
		onscrollend,
		onwheel,
		ontouchstart,
		onpointerdown,
		...rest
	}: ConversationContentProps = $props();

	const conversation = getConversationContext();
	let scrollable = $state(false);
	let viewport = $state<HTMLDivElement>();
	let previousScrollTop = 0;
	let userScrollIntent = false;

	function isNearBottom(viewport: HTMLDivElement) {
		const remaining = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
		return remaining <= Math.max(0, conversation.threshold);
	}

	function measure(viewport: HTMLDivElement) {
		scrollable = viewport.scrollHeight - viewport.clientHeight > 1;
		const nearBottom = isNearBottom(viewport);
		conversation.atBottom = nearBottom;
		if (nearBottom) {
			conversation.follow = true;
			conversation.scrollingToBottom = false;
		}
		return nearBottom;
	}

	function handleScroll(viewport: HTMLDivElement) {
		const nextScrollTop = viewport.scrollTop;
		const nearBottom = measure(viewport);

		if (
			!nearBottom &&
			(userScrollIntent ||
				(!conversation.scrollingToBottom && nextScrollTop < previousScrollTop - 1))
		) {
			conversation.follow = false;
			conversation.scrollingToBottom = false;
		}

		previousScrollTop = nextScrollTop;
		userScrollIntent = false;
	}

	function observeViewport(viewport: HTMLDivElement) {
		untrack(() => {
			conversation.viewport = viewport;
			previousScrollTop = viewport.scrollTop;
			measure(viewport);
		});

		const transcript = viewport.querySelector<HTMLElement>('[data-ui="conversation-transcript"]');
		const observer = new ResizeObserver(() => {
			if (conversation.follow) conversation.scrollToBottom('auto');
			else measure(viewport);
		});
		observer.observe(viewport);
		if (transcript) observer.observe(transcript);

		$effect(() => {
			if (conversation.follow && !conversation.scrollingToBottom) {
				viewport.scrollTop = viewport.scrollHeight;
			}
		});

		return () => {
			observer.disconnect();
			if (conversation.viewport === viewport) conversation.viewport = undefined;
		};
	}

	$effect(() => {
		if (viewport) return observeViewport(viewport);
	});
</script>

<!-- Named overflow regions need a focus target for reliable keyboard scrolling. -->
<ScrollArea
	bind:element={viewport}
	showCues={false}
	{...rest}
	data-ui="conversation-content"
	data-state={conversation.follow ? 'following' : 'paused'}
	role="log"
	aria-label={ariaLabel}
	aria-live="polite"
	aria-relevant="additions text"
	tabindex={tabindex ?? (scrollable ? 0 : undefined)}
	class={cn(
		className,
		'h-full min-h-0 [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary/50'
	)}
	onscroll={(event) => {
		handleScroll(event.currentTarget);
		onscroll?.(event);
	}}
	onscrollend={(event) => {
		conversation.scrollingToBottom = false;
		measure(event.currentTarget);
		onscrollend?.(event);
	}}
	onwheel={(event) => {
		userScrollIntent = true;
		onwheel?.(event);
	}}
	ontouchstart={(event) => {
		userScrollIntent = true;
		ontouchstart?.(event);
	}}
	onpointerdown={(event) => {
		userScrollIntent = true;
		onpointerdown?.(event);
	}}
>
	<div
		data-ui="conversation-transcript"
		class="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6"
	>
		{@render children?.()}
	</div>
</ScrollArea>
