/**
 * Reactive `.dark` detection.
 *
 * Tracks the `dark` class that theme togglers (mode-watcher et al.) flip on the
 * document element, so components can choose light/dark-specific variants
 * (e.g. an outline Cancel in light, ghost in dark). SSR-safe: starts light and
 * corrects on hydration.
 */
export declare function useIsDark(): {
    readonly current: boolean;
};
