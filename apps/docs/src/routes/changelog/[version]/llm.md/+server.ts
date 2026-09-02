import { error } from '@sveltejs/kit';
import { changelogLlmMarkdown, changelogLlmVersions } from '$lib/changelog';
import { markdownResponse } from '$lib/markdown-response';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
    return changelogLlmVersions.map((version) => ({ version }));
};

export const GET: RequestHandler = ({ params }) => {
    const content = changelogLlmMarkdown(params.version);
    if (!content) {
        error(404, 'LLM changelog not found');
    }

    return markdownResponse(content);
};
