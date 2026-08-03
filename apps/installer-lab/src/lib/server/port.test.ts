import { describe, expect, test } from 'vitest';
import net from 'node:net';
import { findAvailablePort } from './port';

describe('loopback port selection', () => {
    test('returns a port that can be bound on 127.0.0.1', async () => {
        const port = await findAvailablePort();
        expect(port).toBeGreaterThan(0);
        await new Promise<void>((resolve, reject) => {
            const server = net.createServer();
            server.once('error', reject);
            server.listen(port, '127.0.0.1', () => server.close(() => resolve()));
        });
    });
});
