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

export function isValidHex(h: string): boolean {
    return /^#[0-9a-fA-F]{6}$/.test(h);
}

export function hexToHsv(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    if (h.length !== 6) {
        return [0, 0, 100];
    }
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }
        hue = hue * 60;
        if (hue < 0) {
            hue += 360;
        }
    }
    return [
        Math.round(hue),
        max === 0 ? 0 : Math.round((delta / max) * 100),
        Math.round(max * 100)
    ];
}

export function hsvToHex(hue: number, sat: number, val: number): string {
    const s = sat / 100;
    const v = val / 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hue < 60) {
        r = c;
        g = x;
    } else if (hue < 120) {
        r = x;
        g = c;
    } else if (hue < 180) {
        g = c;
        b = x;
    } else if (hue < 240) {
        g = x;
        b = c;
    } else if (hue < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }
    const toH = (n: number) =>
        Math.round((n + m) * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${toH(r)}${toH(g)}${toH(b)}`;
}

export function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    if (h.length !== 6) {
        return [255, 255, 255];
    }
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function rgbToHex(red: number, green: number, blue: number): string {
    const toHex = (value: number) =>
        Math.round(Math.max(0, Math.min(255, value)))
            .toString(16)
            .padStart(2, '0');
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

/**
 * HSL gives the user direct lightness control (instead of HSV's "value"),
 * which is what you reach for when tweaking neutrals / dark variants.
 */
export function hexToHsl(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    if (h.length !== 6) {
        return [0, 0, 100];
    }
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const l = (max + min) / 2;
    let hue = 0;
    let sat = 0;
    if (delta !== 0) {
        sat = delta / (1 - Math.abs(2 * l - 1));
        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }
        hue *= 60;
        if (hue < 0) {
            hue += 360;
        }
    }
    return [Math.round(hue), Math.round(sat * 100), Math.round(l * 100)];
}

export function hslToHex(hue: number, sat: number, light: number): string {
    const s = sat / 100;
    const l = light / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hue < 60) {
        r = c;
        g = x;
    } else if (hue < 120) {
        r = x;
        g = c;
    } else if (hue < 180) {
        g = c;
        b = x;
    } else if (hue < 240) {
        g = x;
        b = c;
    } else if (hue < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }
    const toH = (n: number) =>
        Math.round((n + m) * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${toH(r)}${toH(g)}${toH(b)}`;
}
