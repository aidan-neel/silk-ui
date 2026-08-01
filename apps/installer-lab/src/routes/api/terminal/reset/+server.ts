import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isActivePhase, isInstallPath, isRunSource } from '$lib/run-types';
import { assertLocalRequest } from '$lib/server/local-only';
import { runManager } from '$lib/server/run-manager';
import { terminalManager } from '$lib/server/terminal-manager';

export const POST: RequestHandler = async (event) => {
    assertLocalRequest(event);
    if (isActivePhase((await runManager.getSnapshot()).phase)) {
        error(409, 'Cancel the automatic installer run before resetting the manual workspace.');
    }
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
    return json(
        { snapshot: await terminalManager.prepare(source, installPath, true) },
        { status: 202 }
    );
};
