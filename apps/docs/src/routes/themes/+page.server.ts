import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import { listRegistryThemes } from '$lib/server/theme-registry';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		return { themes: await listRegistryThemes(fetch) };
	} catch {
		return { themes: builtInThemePresets };
	}
};
