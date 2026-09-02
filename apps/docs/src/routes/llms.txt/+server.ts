import { llmsTxt } from '$lib/llms';
import { markdownResponse } from '$lib/markdown-response';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => markdownResponse(llmsTxt(url.origin));
