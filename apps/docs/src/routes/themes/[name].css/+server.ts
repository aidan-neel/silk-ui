import { themeToCss } from '@sivir-ui/svelte/themes/theme';
import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    const theme = builtInThemePresets.find((preset) => preset.slug === params.name);
    if (theme) {
        return new Response(themeToCss(theme), {
            headers: {
                'content-type': 'text/css; charset=utf-8',
                'cache-control': 'public, max-age=3600'
            }
        });
    }

    error(404, `Theme '${params.name}' not found`);
};
