import type { RequestHandler } from './$types';
import { RegistryRequestError, getRegistryThemeBySlug } from '$lib/server/theme-registry';

function failure(err: unknown, fallback: string) {
    const status = err instanceof RegistryRequestError ? err.status : 500;
    const message = err instanceof Error ? err.message : fallback;
    return new Response(message, { status });
}

export const GET: RequestHandler = async ({ fetch, params }) => {
    try {
        const theme = await getRegistryThemeBySlug(fetch, params.slug);
        return new Response(JSON.stringify(theme), {
            headers: { 'content-type': 'application/json; charset=utf-8' }
        });
    } catch (err) {
        return failure(err, 'Failed to fetch theme.');
    }
};
