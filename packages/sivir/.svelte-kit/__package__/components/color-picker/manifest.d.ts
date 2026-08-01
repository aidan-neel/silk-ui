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
export declare const manifest: Manifest;
