import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Color picker.
 *
 * 1.0.0 -- initial.
 * 2.0.0: conversion helpers (hexToHsv, hsvToHex, hexToHsl, hslToHex,
 *        isValidHex) extracted to `conversions.ts`. No public-API change;
 *        internal refactor for testability.
 * 3.0.0: BREAKING -- split into a compound API (ColorPicker.Root, .Trigger,
 *        .Content) matching the Popover convention. State is shared via
 *        context. The single `<ColorPicker>` component is gone.
 */
export const manifest: Manifest = {
    name: 'color-picker',
    version: '3.0.0',
    visibility: 'public',
    description:
        'Popover-based color picker with SB drag, hue strip, hex input, and HSL sliders. Optional preset swatches. Compound: Root / Trigger / Content.',
    files: [
        'components/color-picker/color-picker-root.svelte',
        'components/color-picker/color-picker-trigger.svelte',
        'components/color-picker/color-picker-content.svelte',
        'components/color-picker/context.ts',
        'components/color-picker/conversions.ts',
        'components/color-picker/index.ts',
        'components/color-picker/manifest.ts'
    ],
    components: ['popover', 'button'],
    shared: ['utils.cn'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
