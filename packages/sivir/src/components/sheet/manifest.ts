import type { Manifest } from '@sivir/ui/_manifest/types';

/**
 * Sheet -- side-anchored slide-in panel. Composes `_internal/overlay` for
 * the shared focus-trap / click-outside / Escape / body-scroll-lock
 * concerns and uses Svelte transitions for its directional enter/exit motion.
 *
 * Version history:
 *   1.0.0 -- initial manifest. Sheet-content consumes `_internal/overlay`
 *           (resolves F-30). The public component API (Root, Content,
 *           Trigger, Title, Description, Header, Footer, Close) and the
 *           `side`/`allowClickOutside` props are stable.
 */
export const manifest: Manifest = {
	name: 'sheet',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Side-anchored drawer overlay (left | right). Composes _internal/overlay for shared mechanics and Svelte transitions for motion.',
	role: 'dialog',
	files: [
		'components/sheet/sheet.svelte',
		'components/sheet/sheet-content.svelte',
		'components/sheet/sheet-trigger.svelte',
		'components/sheet/sheet-title.svelte',
		'components/sheet/sheet-description.svelte',
		'components/sheet/sheet-header.svelte',
		'components/sheet/sheet-footer.svelte',
		'components/sheet/sheet-close.svelte',
		'components/sheet/context.svelte.ts',
		'components/sheet/index.ts',
		'components/sheet/manifest.ts'
	],
	components: ['button', '_internal/overlay'],
	shared: ['utils.cn', 'utils.createContext', 'transition'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};
