import { setContext, getContext, onDestroy } from 'svelte';
export const STATE_KEY = Symbol('TOAST');
const toastTimeouts = new Map();
const TOAST_EXIT_DURATION = 340;
let nextToastId = 0;
/**
 * Client toast runtime.
 *
 * - Browser: one shared store for every <Toaster />. Free-function
 *   toast(...) always writes here, so toasts survive page navigations
 *   and stack together. Only the primary host renders (first mounted;
 *   next host promoted on unmount) so nested Toasters cannot duplicate
 *   or mis-position the stack.
 * - SSR: activeState stays undefined and toast(...) is a no-op —
 *   eliminating the cross-request bleed bug (P3-F12). Each server
 *   Toaster gets an inert local state it never publishes.
 */
let activeState;
let clientState;
let nextHostId = 0;
const liveHosts = [];
/** Reactive primary host id — Toaster instances $derived against this. */
let primaryHostId = $state(null);
/** Clears the pending timeout for a toast when one exists. */
function clearToastTimeout(id) {
    const entry = toastTimeouts.get(id);
    if (!entry) {
        return;
    }
    clearTimeout(entry.timeout);
    toastTimeouts.delete(id);
}
/** Starts the exit lifecycle for a toast and removes it after the exit duration. */
function dismissToastForState(state, id) {
    if (!state?.data) {
        return;
    }
    const current = state.data.toasts.find((t) => t.id === id);
    if (!current) {
        return;
    }
    if (current.leaving) {
        return;
    }
    current.leaving = true;
    clearToastTimeout(id);
    toastTimeouts.set(id, {
        state,
        timeout: setTimeout(() => {
            state.data.toasts = state.data.toasts.filter((t) => t.id !== id);
            toastTimeouts.delete(id);
        }, TOAST_EXIT_DURATION)
    });
}
function dismissToast(id) {
    dismissToastForState(activeState, id);
}
/** Schedules automatic dismissal for a toast after the provided duration. */
function scheduleToastRemoval(id, duration, state = activeState) {
    if (!state) {
        return;
    }
    clearToastTimeout(id);
    toastTimeouts.set(id, {
        state,
        timeout: setTimeout(() => dismissToastForState(state, id), duration)
    });
}
/** Pauses a toast timer while the user is interacting with it. */
function pauseToast(id) {
    const state = activeState;
    if (!state?.data) {
        return;
    }
    const current = state.data.toasts.find((t) => t.id === id);
    if (!current || current.persistent || current.paused || current.leaving) {
        return;
    }
    current.paused = true;
    const elapsed = Date.now() - (current.createdAt ?? Date.now());
    current.remaining = Math.max((current.remaining ?? current.duration ?? 5600) - elapsed, 0);
    clearToastTimeout(id);
}
/** Resumes a paused toast timer using its remaining duration. */
function resumeToast(id) {
    const state = activeState;
    if (!state?.data) {
        return;
    }
    const current = state.data.toasts.find((t) => t.id === id);
    if (!current || current.persistent || !current.paused || current.leaving) {
        return;
    }
    current.paused = false;
    current.createdAt = Date.now();
    scheduleToastRemoval(id, current.remaining ?? current.duration ?? 4200);
}
/** Updates a toast in place and reschedules dismissal when needed. */
function updateToastForState(state, id, updates) {
    if (!state?.data) {
        return;
    }
    const current = state.data.toasts.find((t) => t.id === id);
    if (!current) {
        return;
    }
    Object.assign(current, updates);
    if (updates.leaving === false) {
        current.leaving = false;
    }
    if (!updates.persistent && updates.duration !== undefined) {
        scheduleToastRemoval(id, updates.duration, state);
    }
}
function updateToast(id, updates) {
    updateToastForState(activeState, id, updates);
}
/** Creates a toast instance, registers its actions, and returns the live object. */
function createToast(toastData, state = activeState) {
    if (!state?.data) {
        return toastData;
    }
    const toastId = (nextToastId += 1);
    const duration = toastData.duration ?? 5600;
    const nextToast = {
        ...toastData,
        id: toastId,
        duration,
        type: toastData.type ?? 'default',
        exitable: toastData.exitable ?? true,
        createdAt: Date.now(),
        remaining: duration,
        paused: false,
        leaving: false
    };
    nextToast.exit = () => dismissToastForState(state, toastId);
    nextToast.update = (updates) => updateToastForState(state, toastId, updates);
    if (state.data.toasts.length >= 5) {
        const oldest = state.data.toasts[0];
        if (oldest?.id !== undefined) {
            dismissToastForState(state, oldest.id);
        }
    }
    state.data.toasts = [...state.data.toasts, nextToast];
    if (!nextToast.persistent) {
        scheduleToastRemoval(toastId, duration, state);
    }
    return nextToast;
}
/** Wraps a promise with loading, success, and error toast states. */
function toastPromise(promise, messages) {
    const state = activeState;
    const t = createToast({
        title: messages.loading,
        description: messages.loadingDescription,
        type: 'loading',
        persistent: true,
        exitable: false
    }, state);
    promise
        .then((data) => {
        if (t.id === undefined) {
            return;
        }
        const title = typeof messages.success === 'function' ? messages.success(data) : messages.success;
        const description = messages.successDescription
            ? typeof messages.successDescription === 'function'
                ? messages.successDescription(data)
                : messages.successDescription
            : undefined;
        updateToastForState(state, t.id, {
            title,
            description,
            type: 'success',
            persistent: false,
            duration: 4200,
            exitable: true,
            createdAt: Date.now(),
            remaining: 4200,
            paused: false,
            leaving: false
        });
        scheduleToastRemoval(t.id, 4200, state);
    })
        .catch((err) => {
        if (t.id === undefined) {
            return;
        }
        const title = typeof messages.error === 'function' ? messages.error(err) : messages.error;
        const description = messages.errorDescription
            ? typeof messages.errorDescription === 'function'
                ? messages.errorDescription(err)
                : messages.errorDescription
            : undefined;
        updateToastForState(state, t.id, {
            title,
            description,
            type: 'error',
            persistent: false,
            duration: 4200,
            exitable: true,
            createdAt: Date.now(),
            remaining: 4200,
            paused: false,
            leaving: false
        });
        scheduleToastRemoval(t.id, 4200, state);
    });
    return t;
}
const toast = createToast;
toast.promise = toastPromise;
toast.success = (title, opts) => createToast({ ...opts, title, type: 'success' });
toast.error = (title, opts) => createToast({ ...opts, title, type: 'error' });
toast.warning = (title, opts) => createToast({ ...opts, title, type: 'warning' });
toast.info = (title, opts) => createToast({ ...opts, title, type: 'info' });
toast.loading = (title, opts) => createToast({ ...opts, title, type: 'loading', persistent: true, exitable: false });
toast.dismiss = (id) => {
    if (id !== undefined) {
        dismissToast(id);
        return;
    }
    const state = activeState;
    if (!state?.data) {
        return;
    }
    [...state.data.toasts].forEach((t) => {
        if (t.id !== undefined) {
            dismissToast(t.id);
        }
    });
};
function getToastUIState() {
    return getContext(STATE_KEY);
}
/**
 * Registers a <Toaster /> host.
 *
 * Browser: joins the shared client store and claims primary render if
 * none exists. SSR: returns inert local state and never publishes it
 * as activeState (P3-F12).
 */
function setToastUIState() {
    /**
     * `$state` must be a declaration initializer, so this always creates one and
     * then either keeps it as the shared client store or discards it, which is
     * what happens under SSR and for subsequent hosts.
     */
    const fresh = $state({ data: { toasts: [] } });
    /** SSR and other non-DOM hosts get isolated inert state; `toast()` no-ops. */
    if (typeof document === 'undefined') {
        setContext(STATE_KEY, fresh);
        return { state: fresh, hostId: -1 };
    }
    if (!clientState) {
        clientState = fresh;
    }
    const state = clientState;
    const hostId = (nextHostId += 1);
    liveHosts.push(hostId);
    if (primaryHostId === null) {
        primaryHostId = hostId;
    }
    activeState = state;
    setContext(STATE_KEY, state);
    onDestroy(() => {
        const idx = liveHosts.indexOf(hostId);
        if (idx !== -1) {
            liveHosts.splice(idx, 1);
        }
        if (primaryHostId === hostId) {
            primaryHostId = liveHosts[0] ?? null;
        }
        /**
         * Keeps `activeState` and `clientState` across host gaps so `toast()`,
         * dismiss, and in-flight timers survive page Toaster remounts. Nothing
         * renders until a primary host mounts again.
         */
    });
    return { state, hostId };
}
/** Reactive primary host id for Toaster render gating. */
function getToastPrimaryHostId() {
    return primaryHostId;
}
/**
 * Test-only escape hatch. Lets unit tests drive toast functions without
 * mounting a Toaster component. Production code uses setToastUIState
 * via the Toaster.
 */
function __setActiveToastStateForTests(state) {
    activeState = state;
    if (state === undefined) {
        clientState = undefined;
        liveHosts.length = 0;
        primaryHostId = null;
        nextHostId = 0;
        for (const [id, entry] of toastTimeouts) {
            clearTimeout(entry.timeout);
            toastTimeouts.delete(id);
        }
    }
    else {
        clientState = state;
    }
}
/**
 * Test-only accessor. Lets unit tests read the currently active toast
 * state without going through Svelte context.
 */
function __getActiveToastStateForTests() {
    return activeState;
}
export { toast, dismissToast, pauseToast, resumeToast, updateToast, getToastUIState, getToastPrimaryHostId, setToastUIState, __setActiveToastStateForTests, __getActiveToastStateForTests };
