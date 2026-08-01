import { describe, expect, test } from 'vitest';
import type { TerminalEvent, TerminalSnapshot } from '$lib/terminal-types';
import { TerminalEventHub } from './terminal-event-hub';

const snapshot: TerminalSnapshot = {
    cwd: '/repo',
    running: false,
    preparing: false,
    activeCommand: null,
    startedAt: null,
    finishedAt: null,
    exitCode: null,
    signal: null,
    prepared: false,
    source: null,
    installPath: null
};

describe('terminal event replay', () => {
    test('replays persisted log before the latest snapshot', () => {
        const hub = new TerminalEventHub(snapshot);
        hub.seed({ ...snapshot, exitCode: 0 }, 'existing output\n');
        const events: TerminalEvent[] = [];
        const unsubscribe = hub.subscribe((event) => events.push(event));

        expect(events).toEqual([
            { type: 'log', chunk: 'existing output\n' },
            { type: 'snapshot', snapshot: { ...snapshot, exitCode: 0 } }
        ]);
        unsubscribe();
    });

    test('broadcasts output, clear, and state changes', () => {
        const hub = new TerminalEventHub(snapshot);
        const events: TerminalEvent[] = [];
        hub.subscribe((event) => events.push(event));
        events.length = 0;

        hub.appendLog('hello');
        hub.clear();
        hub.setSnapshot({ ...snapshot, running: true });

        expect(events).toEqual([
            { type: 'log', chunk: 'hello' },
            { type: 'clear' },
            { type: 'snapshot', snapshot: { ...snapshot, running: true } }
        ]);
    });
});
