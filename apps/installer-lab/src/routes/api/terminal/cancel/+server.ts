import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { assertLocalRequest } from '$lib/server/local-only';
import { terminalManager } from '$lib/server/terminal-manager';

export const POST: RequestHandler = async (event) => {
    assertLocalRequest(event);
    return json({ snapshot: await terminalManager.cancel() });
};
