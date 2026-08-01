import net from 'node:net';

export async function findAvailablePort(host = '127.0.0.1') {
    return new Promise<number>((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.once('error', reject);
        server.listen({ host, port: 0, exclusive: true }, () => {
            const address = server.address();
            if (!address || typeof address === 'string') {
                server.close();
                reject(new Error('Could not reserve a loopback port'));
                return;
            }
            const port = address.port;
            server.close((error) => (error ? reject(error) : resolve(port)));
        });
    });
}

export async function waitForHttpReady(
    url: string,
    options: { timeoutMs?: number; signal?: AbortSignal } = {}
) {
    const timeoutMs = options.timeoutMs ?? 30_000;
    const deadline = Date.now() + timeoutMs;
    let lastError: unknown;
    while (Date.now() < deadline) {
        if (options.signal?.aborted) throw options.signal.reason ?? new Error('Cancelled');
        try {
            const response = await fetch(url, { signal: options.signal });
            if (response.ok) return;
            lastError = new Error(`Preview returned HTTP ${response.status}`);
        } catch (error) {
            lastError = error;
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
    }
    throw new Error(`Preview was not HTTP-ready after ${timeoutMs}ms: ${String(lastError)}`);
}
