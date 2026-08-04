import { changelogVersions } from '$lib/changelog';
import { components } from '$lib/components';
import type { RequestHandler } from './$types';

const staticPaths = [
    '/',
    '/docs/introduction',
    '/docs/installation',
    '/docs/theming',
    '/docs/components',
    ...changelogVersions.map((version) => `/changelog/${version}`)
];

function escapeXml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;'
        }[character] as string;
    });
}

export const GET: RequestHandler = ({ url }) => {
    const paths = [
        ...staticPaths,
        ...components.map((component) => `/docs/components/${component}`)
    ];
    const urls = paths
        .map((path) => `  <url><loc>${escapeXml(new URL(path, url.origin).href)}</loc></url>`)
        .join('\n');

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        {
            headers: {
                'cache-control': 'public, max-age=3600',
                'content-type': 'application/xml; charset=utf-8'
            }
        }
    );
};
