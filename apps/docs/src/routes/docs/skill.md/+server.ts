import { markdownResponse } from '$lib/markdown-response';
import { skillMarkdown } from '$lib/skill';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => markdownResponse(skillMarkdown(url.origin));
