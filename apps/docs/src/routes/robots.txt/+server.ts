import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
    return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'text/plain; charset=utf-8'
        }
    });
};
