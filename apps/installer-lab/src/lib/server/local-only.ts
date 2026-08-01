import { error, type RequestEvent } from '@sveltejs/kit';

export function assertLocalRequest(event: Pick<RequestEvent, 'getClientAddress' | 'url'>) {
    let address: string;
    try {
        address = event.getClientAddress();
    } catch {
        address = event.url.hostname;
    }
    const normalized = address.replace(/^::ffff:/, '');
    if (!['127.0.0.1', '::1', 'localhost'].includes(normalized)) {
        error(403, 'Installer lab endpoints are only available from localhost.');
    }
}
