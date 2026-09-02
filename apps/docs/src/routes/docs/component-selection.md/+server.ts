import { markdownResponse } from '$lib/markdown-response';
import { componentSelectionMarkdown } from '$lib/skill';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
    return markdownResponse(componentSelectionMarkdown(url.origin));
};
