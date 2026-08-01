import { describe, expect, test } from 'vitest';
import type { RunSnapshot } from '$lib/run-types';
import { RunEventHub } from './event-hub';

const snapshot: RunSnapshot = {
    id: 'run-1',
    phase: 'checking',
    source: 'local',
    installPath: 'cli',
    startedAt: '2026-01-01T00:00:00.000Z',
    finishedAt: null,
    elapsedMs: 100,
    componentCount: 40,
    version: '0.1.0',
    previewUrl: null,
    previewPid: null,
    activeCommand: null,
    failure: null
};

describe('SSE event replay source', () => {
    test('replays the raw log before the latest snapshot and stops after unsubscribe', () => {
        const hub = new RunEventHub(snapshot);
        hub.appendLog('one\n');
        hub.appendLog('two\n');
        const events: string[] = [];
        const unsubscribe = hub.subscribe((event) => {
            events.push(event.type === 'log' ? event.chunk : event.snapshot.phase);
        });
        expect(events).toEqual(['one\ntwo\n', 'checking']);
        unsubscribe();
        hub.appendLog('three\n');
        expect(events).toHaveLength(2);
    });
});
