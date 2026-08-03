import type { RunPhase } from '$lib/run-types';

export const allowedTransitions: Record<RunPhase, readonly RunPhase[]> = {
    idle: ['cleaning'],
    cleaning: ['scaffolding', 'failed', 'cancelled'],
    scaffolding: ['resolving-artifact', 'failed', 'cancelled'],
    'resolving-artifact': ['installing', 'failed', 'cancelled'],
    installing: ['generating', 'failed', 'cancelled'],
    generating: ['checking', 'failed', 'cancelled'],
    checking: ['building', 'failed', 'cancelled'],
    building: ['starting', 'failed', 'cancelled'],
    starting: ['ready', 'failed', 'cancelled'],
    ready: ['cleaning', 'failed'],
    failed: ['cleaning'],
    cancelled: ['cleaning']
};

export function canTransition(from: RunPhase, to: RunPhase) {
    return from === to || allowedTransitions[from].includes(to);
}

export function assertTransition(from: RunPhase, to: RunPhase) {
    if (!canTransition(from, to)) throw new Error(`Invalid run phase transition: ${from} -> ${to}`);
}
