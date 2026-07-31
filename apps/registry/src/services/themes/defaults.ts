import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import type { Theme, ThemeRecord } from './model';

const DEFAULT_THEME_TIMESTAMP = '2026-07-14T00:00:00.000Z';

export const defaultThemes: readonly Theme[] = builtInThemePresets;

const DEFAULT_SLUGS: ReadonlySet<string> = new Set(defaultThemes.map((theme) => theme.slug));

export function isDefaultSlug(slug: string): boolean {
	return DEFAULT_SLUGS.has(slug);
}

export function findDefaultTheme(slug: string): Theme | undefined {
	return defaultThemes.find((theme) => theme.slug === slug);
}

export function defaultThemeRecord(theme: Theme): ThemeRecord {
	return {
		...theme,
		id: `default:${theme.slug}`,
		createdAt: DEFAULT_THEME_TIMESTAMP,
		updatedAt: DEFAULT_THEME_TIMESTAMP
	};
}
