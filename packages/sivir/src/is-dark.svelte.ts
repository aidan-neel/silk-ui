/**
 * Reactive `.dark` detection.
 *
 * Tracks the `dark` class that theme togglers (mode-watcher et al.) flip on the
 * document element, so components can choose light/dark-specific variants
 * (e.g. an outline Cancel in light, ghost in dark). SSR-safe: starts light and
 * corrects on hydration.
 */
export function useIsDark() {
	let dark = $state(
		typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
	);

	$effect(() => {
		const root = document.documentElement;
		const update = () => {
			dark = root.classList.contains('dark');
		};
		update();
		const mo = new MutationObserver(update);
		mo.observe(root, { attributes: true, attributeFilter: ['class'] });
		return () => mo.disconnect();
	});

	return {
		get current() {
			return dark;
		}
	};
}
