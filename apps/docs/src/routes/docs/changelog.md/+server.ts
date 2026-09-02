import { changelogDocsMarkdown } from '$lib/changelog';
import { markdownResponse } from '$lib/markdown-response';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
    return markdownResponse(`# Changelog\n\n${changelogDocsMarkdown()}\n`);
};
