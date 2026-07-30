<script lang="ts">
	import { cn, pressable } from '@sivir/ui/utils';
	import { checkbox, checkboxBox, checkboxText } from './variants';

	let {
		checked = $bindable<boolean>(),
		label,
		description,
		disabled,
		variant = 'default',
		class: classProp,
		...rest
	}: {
		checked: boolean;
		label?: string;
		description?: string;
		disabled?: boolean;
		variant?: 'default' | 'primary';
		class?: string;
	} = $props();
</script>

<label
	{...rest}
	class={cn(
		classProp,
		'min-h-11 md:min-h-0',
		checkbox({ variant, disabled: disabled ?? false, checked: checked ?? false })
	)}
>
	{#if disabled}
		<input type="checkbox" class="peer absolute size-4 opacity-0" disabled aria-checked={checked} />
	{:else}
		<input
			type="checkbox"
			class="peer absolute size-4 opacity-0"
			bind:checked
			aria-checked={checked}
		/>
	{/if}

	<!-- Single box: fill crossfades; Lucide check path stroke-draws in. -->
	<span
		use:pressable
		data-ui="checkbox-box"
		data-state={checked ? 'checked' : 'unchecked'}
		class={checkboxBox({ checked: checked ?? false })}
		aria-hidden="true"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class={cn(
				'size-3 text-[var(--color-on-primary)] transition-[opacity,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
				checked ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
			)}
		>
			<!-- Lucide `check` path (viewBox 0 0 24 24). -->
			<path
				d="M20 6 9 17l-5-5"
				pathLength="1"
				class={cn(
					'[stroke-dasharray:1] transition-[stroke-dashoffset] motion-reduce:transition-none',
					checked
						? '[stroke-dashoffset:0] [transition-duration:200ms] [transition-timing-function:var(--ease-press)] [transition-delay:30ms]'
						: '[stroke-dashoffset:1] [transition-duration:90ms] [transition-timing-function:var(--ease-out)] [transition-delay:0ms]'
				)}
			/>
		</svg>
	</span>

	{#if label}
		<div class="flex flex-col justify-center">
			<!-- token-lint-disable-next-line no-literal-length: fine-tuning vertical alignment of label -->
			<span class={cn(checkboxText(), 'mt-[-0.2rem]')} role="presentation">
				{label}
			</span>
			{#if description}
				<span
					class="text-text [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
				>
					{description}
				</span>
			{/if}
		</div>
	{/if}
</label>
