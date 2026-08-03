import { describe, expect, test } from 'vitest';
import { assertTransition, canTransition } from './state-machine';

describe('run state transitions', () => {
    test('accepts the complete happy path', () => {
        const phases = [
            'idle',
            'cleaning',
            'scaffolding',
            'resolving-artifact',
            'installing',
            'generating',
            'checking',
            'building',
            'starting',
            'ready'
        ] as const;
        for (let index = 1; index < phases.length; index++) {
            expect(canTransition(phases[index - 1], phases[index])).toBe(true);
        }
    });

    test('allows cancellation/failure but rejects phase skipping', () => {
        expect(canTransition('installing', 'cancelled')).toBe(true);
        expect(canTransition('building', 'failed')).toBe(true);
        expect(() => assertTransition('scaffolding', 'building')).toThrow(
            'Invalid run phase transition'
        );
    });
});
