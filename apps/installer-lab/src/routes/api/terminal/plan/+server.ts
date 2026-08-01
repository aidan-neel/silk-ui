import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isInstallPath, isRunSource } from '$lib/run-types';
import { assertLocalRequest } from '$lib/server/local-only';
import { buildManualPlan } from '$lib/server/manual-plan';

export const GET: RequestHandler = async (event) => {
    assertLocalRequest(event);
    const source = event.url.searchParams.get('source');
    const installPath = event.url.searchParams.get('installPath');
    if (!isRunSource(source) || !isInstallPath(installPath)) {
        error(400, 'source and installPath must be supported enum values.');
    }
    return json({ plan: await buildManualPlan(source, installPath) });
};
