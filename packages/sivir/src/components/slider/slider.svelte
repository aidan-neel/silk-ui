<!-- token-lint-disable-file -->
<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SliderProps } from '.';

    let {
        class: className,
        value = $bindable(0),
        min = 0,
        max = 100,
        step = 1,
        disabled = false,
        label,
        onValueChange,
        ...rest
    }: SliderProps = $props();
    const pct = $derived(
        max > min ? Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100) : 0
    );

    function handle(event: Event) {
        const next = Number((event.target as HTMLInputElement).value);
        value = next;
        onValueChange?.(next);
    }

    function startDrag(event: PointerEvent) {
        const input = event.currentTarget as HTMLInputElement;
        if (input.disabled) {
            return;
        }
        input.dataset.dragging = '';
    }

    function endDrag(event: PointerEvent) {
        delete (event.currentTarget as HTMLInputElement).dataset.dragging;
    }
</script>

<div
    data-ui="slider"
    class={cn('relative flex w-full select-none items-center', disabled && 'opacity-50', className)}
    {...rest}
>
    <div class="relative h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
            class="absolute inset-y-0 left-0 rounded-full bg-primary"
            style:width={`${pct}%`}
        ></div>
    </div>
    <input
        type="range"
        {min}
        {max}
        {step}
        {disabled}
        {value}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        oninput={handle}
        onpointerdown={startDrag}
        onpointerup={endDrag}
        onpointercancel={endDrag}
        class="absolute -inset-y-5 m-0 w-full cursor-pointer touch-pan-y appearance-none bg-transparent focus-visible:outline-none disabled:cursor-not-allowed sm:inset-y-0 sm:touch-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-[transform,box-shadow,scale] [&::-webkit-slider-thumb]:[transition-duration:var(--motion-duration-press)] [&::-webkit-slider-thumb]:ease-[var(--ease-out)] motion-reduce:[&::-webkit-slider-thumb]:transition-none [&:not(:disabled):hover::-webkit-slider-thumb]:scale-110 [&:not(:disabled):hover::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--color-ring)] [&:not(:disabled):active::-webkit-slider-thumb]:scale-110 [&:not(:disabled):active::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--color-ring)] [&:not(:disabled)[data-dragging]::-webkit-slider-thumb]:scale-110 [&:not(:disabled)[data-dragging]::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--color-ring)] motion-reduce:[&:not(:disabled):hover::-webkit-slider-thumb]:scale-100 motion-reduce:[&:not(:disabled):active::-webkit-slider-thumb]:scale-100 motion-reduce:[&:not(:disabled)[data-dragging]::-webkit-slider-thumb]:scale-100 [&:focus-visible::-webkit-slider-thumb]:shadow-[var(--focus-ring)] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-[transform,box-shadow,scale] [&::-moz-range-thumb]:[transition-duration:var(--motion-duration-press)] [&::-moz-range-thumb]:ease-[var(--ease-out)] motion-reduce:[&::-moz-range-thumb]:transition-none [&:not(:disabled):hover::-moz-range-thumb]:scale-110 [&:not(:disabled):hover::-moz-range-thumb]:shadow-[0_0_0_2px_var(--color-ring)] [&:not(:disabled):active::-moz-range-thumb]:scale-110 [&:not(:disabled):active::-moz-range-thumb]:shadow-[0_0_0_4px_var(--color-ring)] [&:not(:disabled)[data-dragging]::-moz-range-thumb]:scale-110 [&:not(:disabled)[data-dragging]::-moz-range-thumb]:shadow-[0_0_0_4px_var(--color-ring)] motion-reduce:[&:not(:disabled):hover::-moz-range-thumb]:scale-100 motion-reduce:[&:not(:disabled):active::-moz-range-thumb]:scale-100 motion-reduce:[&:not(:disabled)[data-dragging]::-moz-range-thumb]:scale-100 [&::-moz-range-track]:bg-transparent"
    />
</div>
