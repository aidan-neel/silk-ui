import { describe, expect, test } from 'vitest';
import { spawnDetached } from './commands';
import { terminateProcess } from './run-manager';

function closed(child: ReturnType<typeof spawnDetached>) {
    return new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
        (resolve, reject) => {
            child.once('error', reject);
            child.once('close', (code, signal) => resolve({ code, signal }));
        }
    );
}

describe('subprocess lifecycle', () => {
    test('surfaces a non-zero subprocess exit', async () => {
        const result = await closed(
            spawnDetached({
                bin: process.execPath,
                args: ['-e', 'process.exit(7)'],
                cwd: process.cwd()
            })
        );
        expect(result.code).toBe(7);
    });

    test('terminates an active detached process group', async () => {
        const child = spawnDetached({
            bin: process.execPath,
            args: ['-e', 'setInterval(() => {}, 1000)'],
            cwd: process.cwd()
        });
        const exit = closed(child);
        await terminateProcess(child, 100);
        const result = await exit;
        expect(result.signal ?? result.code).not.toBeNull();
    });
});
