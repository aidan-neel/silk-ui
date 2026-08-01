import type { RunEvent, RunSnapshot } from '$lib/run-types';

export class RunEventHub {
    private subscribers = new Set<(event: RunEvent) => void>();
    private snapshot: RunSnapshot;
    private log = '';

    constructor(snapshot: RunSnapshot) {
        this.snapshot = snapshot;
    }

    seed(snapshot: RunSnapshot, log: string) {
        this.snapshot = snapshot;
        this.log = log;
    }

    setSnapshot(snapshot: RunSnapshot) {
        this.snapshot = snapshot;
        this.broadcast({ type: 'snapshot', snapshot });
    }

    appendLog(chunk: string) {
        this.log += chunk;
        this.broadcast({ type: 'log', chunk });
    }

    subscribe(callback: (event: RunEvent) => void) {
        this.subscribers.add(callback);
        if (this.log) callback({ type: 'log', chunk: this.log });
        callback({ type: 'snapshot', snapshot: this.snapshot });
        return () => this.subscribers.delete(callback);
    }

    private broadcast(event: RunEvent) {
        for (const subscriber of this.subscribers) subscriber(event);
    }
}
