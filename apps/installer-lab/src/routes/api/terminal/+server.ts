import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isActivePhase } from '$lib/run-types';
import { assertLocalRequest } from '$lib/server/local-only';
import { runManager } from '$lib/server/run-manager';
import { terminalManager } from '$lib/server/terminal-manager';

export const GET: RequestHandler = async (event) => {
    assertLocalRequest(event);
    return json({ snapshot: await terminalManager.getSnapshot() });
};

export const POST: RequestHandler = async (event) => {
    assertLocalRequest(event);
    let body: unknown;
    try {
        body = await event.request.json();
    } catch {
        error(400, 'Expected a JSON request body.');
    }
    const command = (body as { command?: unknown })?.command;
    if (typeof command !== 'string') error(400, 'command must be a string.');
    if (isActivePhase((await runManager.getSnapshot()).phase)) {
        error(409, 'Cancel the automatic installer run before using the manual terminal.');
    }
    try {
        return json({ snapshot: await terminalManager.execute(command) }, { status: 202 });
    } catch (cause) {
        error(409, cause instanceof Error ? cause.message : String(cause));
    }
};
