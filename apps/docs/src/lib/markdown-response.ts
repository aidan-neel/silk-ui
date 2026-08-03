export function markdownResponse(content: string): Response {
    return new Response(content, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'text/markdown; charset=utf-8'
        }
    });
}
