export declare const STATE_KEY: unique symbol;
export interface ToastUIState {
    toasts: Toast[];
}
export interface ToastState {
    data: ToastUIState;
}
export interface ToastAction {
    label: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    callback: () => void;
}
export interface Toast {
    title: string;
    duration?: number;
    description?: string;
    type?: 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default';
    actions?: ToastAction[];
    id?: number;
    persistent?: boolean;
    exitable?: boolean;
    exit?: () => void;
    update?: (updates: Partial<Toast>) => void;
    createdAt?: number;
    remaining?: number;
    paused?: boolean;
    leaving?: boolean;
}
type ToastInput = Omit<Toast, 'id' | 'exit' | 'update' | 'createdAt' | 'remaining' | 'paused' | 'leaving'>;
interface PromiseMessages<T> {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
    loadingDescription?: string;
    successDescription?: string | ((data: T) => string);
    errorDescription?: string | ((error: unknown) => string);
}
export interface ToastFn {
    (data: ToastInput): Toast;
    promise<T>(promise: Promise<T>, messages: PromiseMessages<T>): Toast;
    success(title: string, opts?: Partial<ToastInput>): Toast;
    error(title: string, opts?: Partial<ToastInput>): Toast;
    warning(title: string, opts?: Partial<ToastInput>): Toast;
    info(title: string, opts?: Partial<ToastInput>): Toast;
    loading(title: string, opts?: Partial<ToastInput>): Toast;
    dismiss(id?: number): void;
}
declare function dismissToast(id: number): void;
/** Pauses a toast timer while the user is interacting with it. */
declare function pauseToast(id: number): void;
/** Resumes a paused toast timer using its remaining duration. */
declare function resumeToast(id: number): void;
declare function updateToast(id: number, updates: Partial<Toast>): void;
declare const toast: ToastFn;
declare function getToastUIState(): ToastState | undefined;
export interface ToastHost {
    state: ToastState;
    hostId: number;
}
/**
 * Registers a <Toaster /> host.
 *
 * Browser: joins the shared client store and claims primary render if
 * none exists. SSR: returns inert local state and never publishes it
 * as activeState (P3-F12).
 */
declare function setToastUIState(): ToastHost;
/** Reactive primary host id for Toaster render gating. */
declare function getToastPrimaryHostId(): number | null;
/**
 * Test-only escape hatch. Lets unit tests drive toast functions without
 * mounting a Toaster component. Production code uses setToastUIState
 * via the Toaster.
 */
declare function __setActiveToastStateForTests(state: ToastState | undefined): void;
/**
 * Test-only accessor. Lets unit tests read the currently active toast
 * state without going through Svelte context.
 */
declare function __getActiveToastStateForTests(): ToastState | undefined;
export { __getActiveToastStateForTests, __setActiveToastStateForTests, dismissToast, getToastPrimaryHostId, getToastUIState, pauseToast, resumeToast, setToastUIState, toast, updateToast };
