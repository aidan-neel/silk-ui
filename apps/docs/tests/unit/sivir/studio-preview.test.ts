import { describe, expect, it } from 'vitest';
import {
	DEFAULT_THEME,
	densities,
	motionFeels,
	neutralTemperatures,
	radiusScales,
	themeToCss
} from '@sivir-ui/svelte/themes/theme';

describe('Theme engine public-axis coverage', () => {
	it('generates non-empty declarations for every supported axis value', () => {
		for (const neutral of neutralTemperatures) {
			expect(themeToCss({ ...DEFAULT_THEME, neutral })).toContain('--sivir-neutral-900:');
		}
		for (const radius of radiusScales) {
			expect(themeToCss({ ...DEFAULT_THEME, radius })).toMatch(/--radius-xl: [^;]+;/);
		}
		for (const density of densities) {
			expect(themeToCss({ ...DEFAULT_THEME, density })).toMatch(/--sivir-space-unit: [^;]+;/);
		}
		for (const motion of motionFeels) {
			expect(themeToCss({ ...DEFAULT_THEME, motion })).toMatch(/--motion-duration-panel: [^;]+;/);
		}
	});
});
