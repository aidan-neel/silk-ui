<!-- token-lint-disable-file -->
<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { getColorPickerContext } from './context';
    import {
        hexToHsl,
        hexToHsv,
        hexToRgb,
        hslToHex,
        hsvToHex,
        isValidHex,
        rgbToHex
    } from './conversions';

    const ctx = getColorPickerContext();

    /** Picker state: the HSV working values plus the raw hex field. */
    let hue = $state(0);
    let sat = $state(0);
    let val = $state(100);
    let hexInput = $state(isValidHex(ctx.value) ? ctx.value.toLowerCase() : '#000000');
    let sbEl = $state<HTMLElement | undefined>(undefined);
    let hueEl = $state<HTMLElement | undefined>(undefined);

    /**
     * HSL slider state, owned by the sliders themselves so user intent survives
     * the hex round-trip. Low-saturation hexes lose hue precision and pure-grey
     * hexes have no hue at all, so deriving HSL straight from the hex would snap
     * the H slider back to 0 mid-drag.
     */
    let hslH = $state(isValidHex(ctx.value) ? hexToHsl(ctx.value)[0] : 0);
    let hslS = $state(isValidHex(ctx.value) ? hexToHsl(ctx.value)[1] : 0);
    let hslL = $state(isValidHex(ctx.value) ? hexToHsl(ctx.value)[2] : 100);
    let rgbR = $state(isValidHex(ctx.value) ? hexToRgb(ctx.value)[0] : 255);
    let rgbG = $state(isValidHex(ctx.value) ? hexToRgb(ctx.value)[1] : 255);
    let rgbB = $state(isValidHex(ctx.value) ? hexToRgb(ctx.value)[2] : 255);
    let skipNextSync = false;

    const hasOptions = $derived(ctx.options.length > 0);
    const hueColor = $derived(`hsl(${hue}, 100%, 50%)`);
    const previewHex = $derived(
        isValidHex(hexInput) ? hexInput : isValidHex(ctx.value) ? ctx.value : '#000000'
    );

    /**
     * Writes one HSL channel and re-derives the hex.
     *
     * At S=0 every hue maps to the same grey hex, so moving H would feel dead;
     * nudging S to a sensible default keeps the chosen hue visible.
     */
    function setHslChannel(channel: 'h' | 's' | 'l', rawValue: string) {
        const next = Number.parseFloat(rawValue);
        if (!Number.isFinite(next)) {
            return;
        }
        if (channel === 'h') {
            hslH = next;
            if (hslS === 0) {
                hslS = 60;
            }
        } else if (channel === 's') {
            hslS = next;
        } else {
            hslL = next;
        }
        const newHex = hslToHex(hslH, hslS, hslL);
        skipNextSync = true;
        applyHex(newHex);
    }

    function setRgbChannel(channel: 'r' | 'g' | 'b', rawValue: string) {
        const next = Number.parseFloat(rawValue);
        if (!Number.isFinite(next)) {
            return;
        }
        if (channel === 'r') {
            rgbR = next;
        } else if (channel === 'g') {
            rgbG = next;
        } else {
            rgbB = next;
        }
        applyHex(rgbToHex(rgbR, rgbG, rgbB));
    }

    /**
     * Syncs the external value into HSV, the hex field, and the HSL sliders.
     *
     * When the incoming hex is achromatic the user's last hue choice is
     * preserved, since the round-trip would otherwise snap H back to 0.
     */
    $effect(() => {
        if (!isValidHex(ctx.value)) {
            return;
        }
        const lower = ctx.value.toLowerCase();
        if (skipNextSync) {
            skipNextSync = false;
            hexInput = lower;
            const [hh, ss, vv] = hexToHsv(ctx.value);
            hue = hh;
            sat = ss;
            val = vv;
            [rgbR, rgbG, rgbB] = hexToRgb(ctx.value);
            return;
        }
        const [h, s, v2] = hexToHsv(ctx.value);
        hue = h;
        sat = s;
        val = v2;
        hexInput = lower;
        const [hh, hs, hl] = hexToHsl(ctx.value);
        if (hs > 0) {
            hslH = hh;
        }
        hslS = hs;
        hslL = hl;
        [rgbR, rgbG, rgbB] = hexToRgb(ctx.value);
    });

    /** Commits a hex value to the picker context. */
    function applyHex(hex: string) {
        if (!isValidHex(hex)) {
            return;
        }
        ctx.apply(hex);
    }

    function applyHsv() {
        const hex = hsvToHex(hue, sat, val);
        hexInput = hex;
        ctx.apply(hex);
    }

    /**
     * Accepts typed or pasted hex.
     *
     * Non-hex characters are stripped first -- pastes carry a `#` prefix, spaces,
     * or a fully-qualified `#5e6ad2` -- so `maxlength=6` on the bare-hex input
     * cannot chop the last character off a 7-character paste.
     */
    function handleHexInput(raw: string) {
        const digits = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
        const cleaned = `#${digits}`;
        hexInput = cleaned;
        if (isValidHex(cleaned)) {
            const [h, s, v2] = hexToHsv(cleaned);
            hue = h;
            sat = s;
            val = v2;
            ctx.apply(cleaned);
        }
    }

    /** Saturation/brightness square drag handling. */
    let draggingSb = false;
    let draggingHue = false;
    let draggingSlider = false;

    function suppressReleaseClick() {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const preventClose = (event: MouseEvent) => {
            event.stopImmediatePropagation();
            document.removeEventListener('click', preventClose, true);
            if (timeout) {
                clearTimeout(timeout);
            }
        };
        document.addEventListener('click', preventClose, true);
        timeout = setTimeout(() => document.removeEventListener('click', preventClose, true), 0);
    }

    function finishDrag(e: PointerEvent, suppressClick = true) {
        if (!draggingSb && !draggingHue && !draggingSlider) {
            return;
        }
        if (draggingSb && sbEl?.hasPointerCapture(e.pointerId)) {
            sbEl.releasePointerCapture(e.pointerId);
        }
        if (draggingHue && hueEl?.hasPointerCapture(e.pointerId)) {
            hueEl.releasePointerCapture(e.pointerId);
        }
        draggingSb = false;
        draggingHue = false;
        draggingSlider = false;
        if (suppressClick) {
            suppressReleaseClick();
        }
    }

    function sbEventToSV(e: PointerEvent) {
        if (!sbEl) {
            return;
        }
        const rect = sbEl.getBoundingClientRect();
        sat = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
        val = Math.round(Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)) * 100);
        applyHsv();
    }

    function onSbDown(e: PointerEvent) {
        draggingSb = true;
        sbEl?.setPointerCapture(e.pointerId);
        sbEventToSV(e);
    }
    function onSbMove(e: PointerEvent) {
        if (draggingSb) {
            sbEventToSV(e);
        }
    }
    /** Hue strip drag handling. */
    function hueEventToH(e: PointerEvent) {
        if (!hueEl) {
            return;
        }
        const rect = hueEl.getBoundingClientRect();
        hue = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 360);
        applyHsv();
    }

    function onHueDown(e: PointerEvent) {
        draggingHue = true;
        hueEl?.setPointerCapture(e.pointerId);
        hueEventToH(e);
    }
    function onHueMove(e: PointerEvent) {
        if (draggingHue) {
            hueEventToH(e);
        }
    }
    function startSliderDrag() {
        draggingSlider = true;
    }
</script>

<svelte:window onpointerup={(e) => finishDrag(e)} onpointercancel={(e) => finishDrag(e, false)} />

<Popover.Content class="w-[244px]" surfaceClass="overflow-hidden !p-0">
    <!-- SB picker (large) -->
    <div
        bind:this={sbEl}
        class="relative h-[148px] w-full cursor-crosshair overflow-hidden rounded-b-[var(--radius-md)] bg-[linear-gradient(to_bottom,transparent,#000),linear-gradient(to_right,#fff,var(--picker-hue))]"
        style:--picker-hue={hueColor}
        onpointerdown={onSbDown}
        onpointermove={onSbMove}
        role="presentation"
    >
        <div
            class="pointer-events-none absolute size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgb(0_0_0_/_0.5)]"
            style:left={`${sat}%`}
            style:top={`${100 - val}%`}
            style:background={previewHex}
        ></div>
    </div>

    <!-- Hue + preview row -->
    <div class="flex items-center gap-2.5 border-b border-border/60 p-2">
        <span
            class="size-7 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
            style:background={previewHex}
            aria-hidden="true"
        ></span>
        <div class="min-w-0 flex-1 space-y-1.5">
            <div
                bind:this={hueEl}
                class="relative h-2.5 w-full cursor-ew-resize overflow-hidden rounded-full bg-[linear-gradient(to_right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]"
                onpointerdown={onHueDown}
                onpointermove={onHueMove}
                role="presentation"
            >
                <div
                    class="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgb(0_0_0_/_0.5)]"
                    style:left={`${(hue / 360) * 100}%`}
                    style:background={hueColor}
                ></div>
            </div>
            <div
                class="flex items-center gap-1 rounded-[var(--radius-md)] border border-border/60 bg-background px-1.5 transition-[border-color,box-shadow] focus-within:border-primary/50 focus-within:shadow-[0_0_0_2px_var(--color-ring)]"
            >
                <span class="font-mono text-[0.78rem] text-foreground-muted">#</span>
                <input
                    class="h-6 min-w-0 flex-1 bg-transparent font-mono text-[0.78rem] uppercase text-foreground outline-none"
                    value={hexInput.replace(/^#/, '')}
                    placeholder="000000"
                    spellcheck={false}
                    autocomplete="off"
                    oninput={(e) => handleHexInput((e.currentTarget as HTMLInputElement).value)}
                    onkeydown={(e) => {
                        if (e.key === 'Enter') {
                            applyHex(hexInput);
                        }
                    }}
                />
            </div>
        </div>
    </div>

    <!-- Format channel sliders -->
    <div class="flex flex-col gap-1.5 border-b border-border/60 p-2">
        {#if ctx.format === 'hsl'}
            {#each [{ key: 'h', label: 'H', max: 360, value: hslH, unit: '°' }, { key: 's', label: 'S', max: 100, value: hslS, unit: '%' }, { key: 'l', label: 'L', max: 100, value: hslL, unit: '%' }] as channel (channel.key)}
                {@const thumbBg =
                    channel.key === 'h'
                        ? `hsl(${channel.value}, ${hslS}%, ${hslL}%)`
                        : channel.key === 's'
                          ? `hsl(${hslH}, ${channel.value}%, ${hslL}%)`
                          : `hsl(${hslH}, ${hslS}%, ${channel.value}%)`}
                <div class="flex items-center gap-2">
                    <span
                        class="w-3 shrink-0 font-mono [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
                    >
                        {channel.label}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={channel.max}
                        step="1"
                        value={channel.value}
                        style:--thumb-bg={thumbBg}
                        onpointerdown={startSliderDrag}
                        oninput={(e) =>
                            setHslChannel(
                                channel.key as 'h' | 's' | 'l',
                                (e.currentTarget as HTMLInputElement).value
                            )}
                        class="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-secondary outline-none dark:bg-[var(--color-border-strong)] focus-visible:shadow-[0_0_0_3px_var(--color-ring)] [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-background)] [&::-webkit-slider-thumb]:[background:var(--thumb-bg)] [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgb(0_0_0_/_0.2)] [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-background)] [&::-moz-range-thumb]:[background:var(--thumb-bg)] [&::-moz-range-thumb]:shadow-[0_1px_3px_rgb(0_0_0_/_0.2)]"
                    />
                    <span
                        class="w-9 shrink-0 text-right font-mono text-[0.66rem] tabular-nums text-foreground"
                    >
                        {channel.value}{channel.unit}
                    </span>
                </div>
            {/each}
        {:else if ctx.format === 'rgb'}
            {#each [{ key: 'r', label: 'R', value: rgbR }, { key: 'g', label: 'G', value: rgbG }, { key: 'b', label: 'B', value: rgbB }] as channel (channel.key)}
                <div class="flex items-center gap-2">
                    <span
                        class="w-3 shrink-0 font-mono [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
                        >{channel.label}</span
                    >
                    <input
                        type="range"
                        min="0"
                        max="255"
                        step="1"
                        value={channel.value}
                        style:--thumb-bg={`rgb(${rgbR}, ${rgbG}, ${rgbB})`}
                        onpointerdown={startSliderDrag}
                        oninput={(e) =>
                            setRgbChannel(
                                channel.key as 'r' | 'g' | 'b',
                                (e.currentTarget as HTMLInputElement).value
                            )}
                        class="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-secondary outline-none dark:bg-[var(--color-border-strong)] focus-visible:shadow-[0_0_0_3px_var(--color-ring)] [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-background)] [&::-webkit-slider-thumb]:[background:var(--thumb-bg)] [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgb(0_0_0_/_0.2)] [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-background)] [&::-moz-range-thumb]:[background:var(--thumb-bg)] [&::-moz-range-thumb]:shadow-[0_1px_3px_rgb(0_0_0_/_0.2)]"
                    />
                    <span
                        class="w-9 shrink-0 text-right font-mono text-[0.66rem] tabular-nums text-foreground"
                        >{channel.value}</span
                    >
                </div>
            {/each}
        {:else}
            {#each [{ key: 'h', label: 'H', max: 360, value: hue, unit: '°' }, { key: 's', label: 'S', max: 100, value: sat, unit: '%' }, { key: 'v', label: 'V', max: 100, value: val, unit: '%' }] as channel (channel.key)}
                <div class="flex items-center gap-2">
                    <span
                        class="w-3 shrink-0 font-mono [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
                        >{channel.label}</span
                    >
                    <input
                        type="range"
                        min="0"
                        max={channel.max}
                        step="1"
                        value={channel.value}
                        style:--thumb-bg={hueColor}
                        onpointerdown={startSliderDrag}
                        oninput={(e) => {
                            const next = Number((e.currentTarget as HTMLInputElement).value);
                            if (channel.key === 'h') {
                                hue = next;
                            } else if (channel.key === 's') {
                                sat = next;
                            } else {
                                val = next;
                            }
                            applyHsv();
                        }}
                        class="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-secondary outline-none dark:bg-[var(--color-border-strong)] focus-visible:shadow-[0_0_0_3px_var(--color-ring)] [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-background)] [&::-webkit-slider-thumb]:[background:var(--thumb-bg)] [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgb(0_0_0_/_0.2)] [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-background)] [&::-moz-range-thumb]:[background:var(--thumb-bg)] [&::-moz-range-thumb]:shadow-[0_1px_3px_rgb(0_0_0_/_0.2)]"
                    />
                    <span
                        class="w-9 shrink-0 text-right font-mono text-[0.66rem] tabular-nums text-foreground"
                        >{channel.value}{channel.unit}</span
                    >
                </div>
            {/each}
        {/if}
    </div>

    <!-- Swatch grid -->
    {#if hasOptions}
        <div class="grid grid-cols-7 gap-1.5 p-2">
            {#each ctx.options as opt (opt.value)}
                {@const isActive = opt.value.toLowerCase() === (ctx.value ?? '').toLowerCase()}
                <button
                    type="button"
                    onclick={() => applyHex(opt.value)}
                    title={opt.label}
                    aria-label={opt.label}
                    class="group relative grid size-6 place-items-center rounded-md ring-1 ring-inset ring-black/10 transition-[transform,box-shadow] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                    style:background={opt.value}
                >
                    {#if isActive}
                        <Check
                            size={12}
                            class="text-white drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.6)]"
                        />
                    {/if}
                </button>
            {/each}
        </div>
    {/if}
</Popover.Content>
