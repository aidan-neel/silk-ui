import { describe, expect, it } from 'vitest';
import {
	hexToHsv,
	hsvToHex,
	hexToHsl,
	hslToHex,
	hexToRgb,
	rgbToHex,
	isValidHex
} from '@sivir/ui/components/color-picker/conversions';

/*
 * P3-F3 resolution: color-conversion helpers extracted from
 * color-picker.svelte into a testable module. Pure functions.
 */

describe('isValidHex', () => {
	it.each([
		['#000000', true],
		['#ffffff', true],
		['#aabbcc', true],
		['#AABBCC', true],
		['#abc', false],
		['ffffff', false],
		['#gghhii', false],
		['#fffffff', false],
		['', false]
	])('isValidHex(%s) === %s', (input, expected) => {
		expect(isValidHex(input)).toBe(expected);
	});
});

describe('hexToHsv', () => {
	it('parses pure red', () => {
		expect(hexToHsv('#ff0000')).toEqual([0, 100, 100]);
	});

	it('parses pure green', () => {
		expect(hexToHsv('#00ff00')).toEqual([120, 100, 100]);
	});

	it('parses pure blue', () => {
		expect(hexToHsv('#0000ff')).toEqual([240, 100, 100]);
	});

	it('parses black', () => {
		expect(hexToHsv('#000000')).toEqual([0, 0, 0]);
	});

	it('parses white', () => {
		expect(hexToHsv('#ffffff')).toEqual([0, 0, 100]);
	});

	it('parses a mid gray', () => {
		const [h, s, v] = hexToHsv('#808080');
		expect(h).toBe(0);
		expect(s).toBe(0);
		expect(v).toBeGreaterThanOrEqual(50);
		expect(v).toBeLessThanOrEqual(51);
	});

	it('returns [0,0,100] for invalid hex (white fallback)', () => {
		expect(hexToHsv('not-a-color')).toEqual([0, 0, 100]);
	});

	it('strips a leading # if present', () => {
		expect(hexToHsv('ff0000')).toEqual([0, 100, 100]);
	});
});

describe('hsvToHex', () => {
	it('produces pure red from (0, 100, 100)', () => {
		expect(hsvToHex(0, 100, 100)).toBe('#ff0000');
	});

	it('produces pure green from (120, 100, 100)', () => {
		expect(hsvToHex(120, 100, 100)).toBe('#00ff00');
	});

	it('produces pure blue from (240, 100, 100)', () => {
		expect(hsvToHex(240, 100, 100)).toBe('#0000ff');
	});

	it('produces black from (h, 0, 0)', () => {
		expect(hsvToHex(0, 0, 0)).toBe('#000000');
		expect(hsvToHex(180, 0, 0)).toBe('#000000');
	});

	it('produces white from (0, 0, 100)', () => {
		expect(hsvToHex(0, 0, 100)).toBe('#ffffff');
	});

	it('always produces a 7-character valid hex string', () => {
		for (let hue = 0; hue < 360; hue += 30) {
			const result = hsvToHex(hue, 50, 50);
			expect(result).toMatch(/^#[0-9a-f]{6}$/);
		}
	});
});

describe('RGB conversion', () => {
	it('converts hex to RGB channels', () => {
		expect(hexToRgb('#5e6ad2')).toEqual([94, 106, 210]);
	});

	it('converts RGB channels to hex', () => {
		expect(rgbToHex(94, 106, 210)).toBe('#5e6ad2');
	});
});

describe('hexToHsv ↔ hsvToHex round trip', () => {
	const samples = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

	it.each(samples)('round trip preserves %s', (hex) => {
		const [h, s, v] = hexToHsv(hex);
		const result = hsvToHex(h, s, v);
		expect(result).toBe(hex);
	});
});

describe('hexToHsl', () => {
	it('parses pure red', () => {
		const [h, s, l] = hexToHsl('#ff0000');
		expect(h).toBe(0);
		expect(s).toBe(100);
		expect(l).toBe(50);
	});

	it('parses pure green', () => {
		const [h, s, l] = hexToHsl('#00ff00');
		expect(h).toBe(120);
		expect(s).toBe(100);
		expect(l).toBe(50);
	});

	it('parses black to lightness 0', () => {
		expect(hexToHsl('#000000')).toEqual([0, 0, 0]);
	});

	it('parses white to lightness 100', () => {
		expect(hexToHsl('#ffffff')).toEqual([0, 0, 100]);
	});

	it('returns [0,0,100] for invalid hex (white fallback)', () => {
		expect(hexToHsl('garbage')).toEqual([0, 0, 100]);
	});
});

describe('hslToHex', () => {
	it('produces pure red from (0, 100, 50)', () => {
		expect(hslToHex(0, 100, 50)).toBe('#ff0000');
	});

	it('produces pure green from (120, 100, 50)', () => {
		expect(hslToHex(120, 100, 50)).toBe('#00ff00');
	});

	it('produces black from (h, s, 0)', () => {
		expect(hslToHex(0, 100, 0)).toBe('#000000');
		expect(hslToHex(180, 50, 0)).toBe('#000000');
	});

	it('produces white from (h, s, 100)', () => {
		expect(hslToHex(0, 100, 100)).toBe('#ffffff');
	});

	it('always produces a 7-character valid hex string', () => {
		for (let hue = 0; hue < 360; hue += 45) {
			const result = hslToHex(hue, 50, 50);
			expect(result).toMatch(/^#[0-9a-f]{6}$/);
		}
	});
});

describe('hexToHsl ↔ hslToHex round trip', () => {
	const samples = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

	it.each(samples)('round trip preserves %s', (hex) => {
		const [h, s, l] = hexToHsl(hex);
		expect(hslToHex(h, s, l)).toBe(hex);
	});
});
