import type { LayoutServerLoad } from './$types';

const GITHUB_REPO = 'aidan-neel/sivir-ui';

async function fetchStarCount(fetchImpl: typeof fetch): Promise<number | null> {
    try {
        const response = await fetchImpl(`https://api.github.com/repos/${GITHUB_REPO}`, {
            headers: { accept: 'application/vnd.github+json' }
        });
        if (!response.ok) return null;
        const data = (await response.json()) as { stargazers_count?: number };
        return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
    } catch {
        return null;
    }
}

export const load: LayoutServerLoad = async ({ fetch, setHeaders, url }) => {
    const starCount = await fetchStarCount(fetch);

    // Cache the layout response edge-side for a minute -- keeps the GitHub call
    // off the hot path without making counts stale. Skipped in dev because Vite
    // HMR re-runs the load within the same request, and SvelteKit's setHeaders
    // throws on a duplicate set of the same header.
    if (!import.meta.env.DEV) {
        setHeaders({ 'cache-control': 'public, max-age=60, stale-while-revalidate=300' });
    }

    return { starCount, origin: url.origin };
};
