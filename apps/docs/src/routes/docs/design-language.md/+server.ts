import { markdownResponse } from '$lib/markdown-response';
import { designLanguageMarkdown } from '$lib/skill';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
    return markdownResponse(designLanguageMarkdown(url.origin));
};
