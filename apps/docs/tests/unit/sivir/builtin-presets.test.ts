import { describe, expect, it } from 'vitest';
import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import { parseTheme } from '@sivir-ui/svelte/themes/theme';

describe('builtInThemePresets', () => {
	it('ships a valid, unique version-2 catalog led by the default theme', () => {
		expect(builtInThemePresets[0].slug).toBe('default');
		expect(builtInThemePresets.length).toBeGreaterThan(1);
		expect(new Set(builtInThemePresets.map((theme) => theme.slug)).size).toBe(
			builtInThemePresets.length
		);
		for (const theme of builtInThemePresets) expect(parseTheme(theme)).toEqual(theme);
	});
});
