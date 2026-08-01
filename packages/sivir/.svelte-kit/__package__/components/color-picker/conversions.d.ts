/**
 * Color-space conversion helpers for the sivir color picker.
 *
 * Pure functions -- no DOM access, no Svelte runes -- testable directly
 * via Vitest.
 *
 * All functions accept 6-char hex strings (with or without leading `#`)
 * and return either tuples `[h, s, v]` / `[h, s, l]` (0-360 / 0-100 /
 * 0-100) or hex strings. Invalid hex defaults to `[0, 0, 100]` (white).
 */
export declare function isValidHex(h: string): boolean;
export declare function hexToHsv(hex: string): [number, number, number];
export declare function hsvToHex(hue: number, sat: number, val: number): string;
export declare function hexToRgb(hex: string): [number, number, number];
export declare function rgbToHex(red: number, green: number, blue: number): string;
/**
 * HSL gives the user direct lightness control (instead of HSV's "value"),
 * which is what you reach for when tweaking neutrals / dark variants.
 */
export declare function hexToHsl(hex: string): [number, number, number];
export declare function hslToHex(hue: number, sat: number, light: number): string;
