import type { ToastState } from '@sivir-ui/svelte/components/toast/lib.svelte.ts';
import {
    __getActiveToastStateForTests,
    __setActiveToastStateForTests,
    dismissToast,
    pauseToast,
    resumeToast,
    toast,
    updateToast
} from '@sivir-ui/svelte/components/toast/lib.svelte.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { required } from '../../test-utils';

/*
 * Toast tests use fake timers. The library's lifecycle is timer-driven
 * (default duration, exit duration, pause/resume).
 *
 * Post-P3-F12 fix: toast state is per-mount, not a module singleton.
 * Tests register a fresh state per test via __setActiveToastStateForTests
 * to drive the toast functions. Production code reaches this via the
 * Toaster component's onMount (setToastUIState).
 */

// Access the active state through the test helper so tests stay in sync
// with the production accessor when refactors happen later.
function toastUIState(): ToastState {
    const s = __getActiveToastStateForTests();
    if (!s) throw new Error('No active toast state in test -- beforeEach setup missing?');
    return s;
}

beforeEach(() => {
    vi.useFakeTimers();
    __setActiveToastStateForTests({ data: { toasts: [] } });
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    __setActiveToastStateForTests(undefined);
});

describe('toast() -- creation', () => {
    it('returns a toast object with an id and createdAt', () => {
        const t = toast({ title: 'hi' });
        expect(t.id).toBeTypeOf('number');
        expect(t.createdAt).toBeTypeOf('number');
    });

    it('adds the toast to the global state array', () => {
        toast({ title: 'one' });
        expect(toastUIState().data.toasts.length).toBe(1);
        expect(toastUIState().data.toasts[0].title).toBe('one');
    });

    it('applies the requested type', () => {
        const t = toast({ title: 'err', type: 'error' });
        expect(t.type).toBe('error');
    });

    it('defaults type to "default" when omitted', () => {
        const t = toast({ title: 'plain' });
        expect(t.type).toBe('default');
    });

    it('honors a custom duration', () => {
        const t = toast({ title: 'long', duration: 10000 });
        expect(t.duration).toBe(10000);
    });

    it('returns an exitable toast by default', () => {
        const t = toast({ title: 'x' });
        expect(t.exitable).toBe(true);
    });
});

describe('toast.success / .error / .warning / .info / .loading', () => {
    it('toast.success sets type=success', () => {
        const t = toast.success('Saved');
        expect(t.type).toBe('success');
        expect(t.title).toBe('Saved');
    });

    it('toast.error sets type=error', () => {
        const t = toast.error('Oops');
        expect(t.type).toBe('error');
    });

    it('toast.warning sets type=warning', () => {
        const t = toast.warning('Heads up');
        expect(t.type).toBe('warning');
    });

    it('toast.info sets type=info', () => {
        const t = toast.info('FYI');
        expect(t.type).toBe('info');
    });

    it('toast.loading sets type=loading and persistent=true', () => {
        const t = toast.loading('Working');
        expect(t.type).toBe('loading');
        expect(t.persistent).toBe(true);
        expect(t.exitable).toBe(false);
    });
});

describe('toast -- auto-dismiss', () => {
    it('removes the toast after the duration + exit duration elapses', async () => {
        const t = toast({ title: 'auto', duration: 1000 });
        expect(toastUIState().data.toasts.length).toBe(1);

        // Advance past the auto-dismiss timeout.
        vi.advanceTimersByTime(1000);
        // Now the toast is marked leaving=true with a 340ms exit duration.
        const current = toastUIState().data.toasts.find((x) => x.id === t.id);
        expect(current?.leaving).toBe(true);

        // Advance past the exit duration (340ms).
        vi.advanceTimersByTime(340);
        expect(toastUIState().data.toasts.find((x) => x.id === t.id)).toBeUndefined();
    });

    it('does not auto-dismiss persistent toasts', () => {
        toast({ title: 'persistent', persistent: true, duration: 1000 });
        expect(toastUIState().data.toasts.length).toBe(1);

        vi.advanceTimersByTime(5000);
        expect(toastUIState().data.toasts.length).toBe(1);
    });
});

describe('toast.dismiss', () => {
    it('removes a toast by id after the exit duration', () => {
        const t = toast({ title: 'x', persistent: true });
        expect(toastUIState().data.toasts.length).toBe(1);

        toast.dismiss(t.id);
        // Advance past the exit duration.
        vi.advanceTimersByTime(340);
        expect(toastUIState().data.toasts.length).toBe(0);
    });

    it('marks the toast leaving=true immediately', () => {
        const t = toast({ title: 'x', persistent: true });
        toast.dismiss(t.id);
        expect(toastUIState().data.toasts.find((x) => x.id === t.id)?.leaving).toBe(true);
    });

    it('dismisses all toasts when called with no id', () => {
        toast({ title: 'a', persistent: true });
        toast({ title: 'b', persistent: true });
        toast({ title: 'c', persistent: true });
        expect(toastUIState().data.toasts.length).toBe(3);

        toast.dismiss();
        vi.advanceTimersByTime(340);
        expect(toastUIState().data.toasts.length).toBe(0);
    });
});

describe('toast -- max 5 toasts', () => {
    it('dismisses the oldest when adding the 6th', () => {
        const ids: number[] = [];
        for (let i = 0; i < 6; i++) {
            const t = toast({ title: `t${i}`, persistent: true });
            if (t.id !== undefined) ids.push(t.id);
        }
        // Advance the exit duration so the oldest is fully removed.
        vi.advanceTimersByTime(340);
        expect(toastUIState().data.toasts.length).toBeLessThanOrEqual(5);
        // The first toast added should be the one that got dismissed.
        expect(toastUIState().data.toasts.find((t) => t.id === ids[0])).toBeUndefined();
    });
});

describe('pauseToast / resumeToast', () => {
    it('pauseToast sets paused=true and computes remaining', () => {
        const t = toast({ title: 'p', duration: 1000 });
        const id = required(t.id);
        vi.advanceTimersByTime(300);
        pauseToast(id);

        const current = required(toastUIState().data.toasts.find((toast) => toast.id === id));
        expect(current.paused).toBe(true);
        expect(current.remaining).toBeLessThanOrEqual(1000);
        expect(current.remaining).toBeGreaterThanOrEqual(0);
    });

    it('resumeToast unpauses and reschedules dismissal', () => {
        const t = toast({ title: 'p', duration: 1000 });
        const id = required(t.id);
        vi.advanceTimersByTime(300);
        pauseToast(id);

        // While paused, the toast does not dismiss.
        vi.advanceTimersByTime(5000);
        expect(toastUIState().data.toasts.find((x) => x.id === t.id)).toBeDefined();

        resumeToast(id);
        const remainingAfterResume =
            toastUIState().data.toasts.find((x) => x.id === t.id)?.remaining ?? 0;
        expect(remainingAfterResume).toBeGreaterThan(0);

        vi.advanceTimersByTime(remainingAfterResume);
        // Now it's marked leaving; advance the exit duration.
        vi.advanceTimersByTime(340);
        expect(toastUIState().data.toasts.find((x) => x.id === t.id)).toBeUndefined();
    });
});

describe('updateToast', () => {
    it('merges updates into an existing toast in place', () => {
        const t = toast({ title: 'before', persistent: true });
        updateToast(required(t.id), { title: 'after', type: 'success' });

        const current = toastUIState().data.toasts.find((x) => x.id === t.id);
        expect(current?.title).toBe('after');
        expect(current?.type).toBe('success');
    });
});

describe('toast.promise -- happy path', () => {
    it('starts as loading, then transitions to success on resolve', async () => {
        vi.useRealTimers(); // promise.then needs real microtask scheduling
        const t = toast.promise(Promise.resolve('done'), {
            loading: 'Loading...',
            success: 'OK',
            error: 'Bad'
        });
        expect(t.type).toBe('loading');

        // Wait one microtask + a tick for the .then handler.
        await new Promise((r) => setTimeout(r, 0));
        const current = toastUIState().data.toasts.find((x) => x.id === t.id);
        expect(current?.type).toBe('success');
        expect(current?.title).toBe('OK');
        vi.useFakeTimers();
    });

    it('transitions to error on reject', async () => {
        vi.useRealTimers();
        const t = toast.promise(Promise.reject(new Error('nope')), {
            loading: 'Loading...',
            success: 'OK',
            error: 'Bad'
        });
        expect(t.type).toBe('loading');

        await new Promise((r) => setTimeout(r, 0));
        const current = toastUIState().data.toasts.find((x) => x.id === t.id);
        expect(current?.type).toBe('error');
        expect(current?.title).toBe('Bad');
        vi.useFakeTimers();
    });
});

describe('dismissToast (internal)', () => {
    it('is a no-op for non-existent ids', () => {
        expect(() => dismissToast(99999)).not.toThrow();
        expect(toastUIState().data.toasts.length).toBe(0);
    });
});
