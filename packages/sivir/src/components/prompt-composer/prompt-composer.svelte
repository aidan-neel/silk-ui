<script lang="ts">
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import { cn } from '@sivir-ui/svelte/utils';
	import type { PromptComposerProps, PromptComposerStatus } from '.';
	import { setPromptComposerContext } from './context.svelte';

	let {
		value = $bindable(''),
		status = 'idle',
		disabled = false,
		allowEmpty = false,
		onSubmit,
		onStop,
		class: className,
		children,
		...rest
	}: PromptComposerProps = $props();

	let form: HTMLFormElement | undefined;
	let pending = $state(false);
	const effectiveStatus = $derived<PromptComposerStatus>(
		status === 'submitting' || pending ? 'submitting' : status
	);

	const context = setPromptComposerContext({
		get value() {
			return value;
		},
		set value(next: string) {
			value = next;
		},
		get status() {
			return effectiveStatus;
		},
		get disabled() {
			return disabled;
		},
		get allowEmpty() {
			return allowEmpty;
		},
		submit() {
			if (!disabled && effectiveStatus !== 'submitting') form?.requestSubmit();
		},
		stop() {
			if (!disabled && effectiveStatus === 'submitting') onStop?.();
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (
			context.disabled ||
			context.status === 'submitting' ||
			(!context.allowEmpty && context.value.trim() === '')
		) {
			return;
		}

		pending = true;
		try {
			await onSubmit?.(context.value, event);
		} finally {
			pending = false;
		}
	}
</script>

<form
	bind:this={form}
	{...rest}
	data-ui="prompt-composer"
	data-state={effectiveStatus}
	data-disabled={disabled || undefined}
	aria-busy={effectiveStatus === 'submitting'}
	onsubmit={handleSubmit}
	class={cn(
		className,
		'relative flex w-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card text-foreground shadow-[var(--elevation-1)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--color-border)_45%,transparent)] transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none focus-within:border-primary/60 focus-within:shadow-[var(--focus-ring),var(--elevation-1)] data-[state=error]:border-[var(--color-error)]'
	)}
>
	{@render children?.()}

	{#if effectiveStatus === 'error'}
		<div
			data-ui="prompt-composer-error"
			role="alert"
			class="mx-2 mb-2 flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-error)]"
		>
			<CircleAlert size={14} strokeWidth={2} aria-hidden="true" />
			<span>Message could not be sent.</span>
		</div>
	{/if}
</form>
