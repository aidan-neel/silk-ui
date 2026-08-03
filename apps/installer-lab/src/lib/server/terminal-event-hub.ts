import type { TerminalEvent, TerminalSnapshot } from '$lib/terminal-types';

export class TerminalEventHub {
    private subscribers = new Set<(event: TerminalEvent) => void>();
    private snapshot: TerminalSnapshot;
    private log = '';

    constructor(snapshot: TerminalSnapshot) {
        this.snapshot = snapshot;
    }

    seed(snapshot: TerminalSnapshot, log: string) {
        this.snapshot = snapshot;
        this.log = log;
    }

    setSnapshot(snapshot: TerminalSnapshot) {
        this.snapshot = snapshot;
        this.broadcast({ type: 'snapshot', snapshot });
    }

    appendLog(chunk: string) {
        this.log += chunk;
        this.broadcast({ type: 'log', chunk });
    }

    clear() {
        this.log = '';
        this.broadcast({ type: 'clear' });
    }

    subscribe(callback: (event: TerminalEvent) => void) {
        this.subscribers.add(callback);
        if (this.log) callback({ type: 'log', chunk: this.log });
        callback({ type: 'snapshot', snapshot: this.snapshot });
        return () => this.subscribers.delete(callback);
    }

    private broadcast(event: TerminalEvent) {
        for (const subscriber of this.subscribers) subscriber(event);
    }
}
