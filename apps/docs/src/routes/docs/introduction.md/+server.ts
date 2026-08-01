import { coreMarkdown } from '$lib/llms';
import { markdownResponse } from '$lib/markdown-response';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => markdownResponse(coreMarkdown('introduction'));
