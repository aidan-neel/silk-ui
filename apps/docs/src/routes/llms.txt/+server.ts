import { llmsTxt } from '$lib/llms';
import { markdownResponse } from '$lib/markdown-response';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => markdownResponse(llmsTxt(url.origin));
