import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isInstallPath, isRunSource } from '$lib/run-types';
import { assertLocalRequest } from '$lib/server/local-only';
import { runManager } from '$lib/server/run-manager';
import { terminalManager } from '$lib/server/terminal-manager';

export const GET: RequestHandler = async (event) => {
    assertLocalRequest(event);
    return json({ snapshot: await runManager.getSnapshot(), log: runManager.getLog() });
};

export const POST: RequestHandler = async (event) => {
    assertLocalRequest(event);
    let body: unknown;
    try {
        body = await event.request.json();
    } catch {
        error(400, 'Expected a JSON request body.');
    }
    const source = (body as { source?: unknown })?.source;
    const installPath = (body as { installPath?: unknown })?.installPath;
    if (!isRunSource(source) || !isInstallPath(installPath)) {
        error(400, 'source and installPath must be supported enum values.');
    }
    const terminal = await terminalManager.getSnapshot();
    if (terminal.running || terminal.preparing) {
        error(409, 'Cancel the manual terminal command before starting an automatic run.');
    }
    return json({ snapshot: await runManager.start(source, installPath) }, { status: 202 });
};
