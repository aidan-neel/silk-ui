/**
 * Manifest schema.
 *
 * Each sivir component exports a `manifest: Manifest` from
 * `components/<name>/manifest.ts`. The CLI consumes these to resolve
 * and install files into consumer projects.
 */

export type ManifestVisibility = 'public' | 'internal';

export type Manifest = {
	/** Component identifier -- matches folder name under components/. */
	name: string;
	/** Semver string. Bumps follow pattern guide Sec.4. */
	version: string;
	/**
	 * `public` components are directly installable via the CLI.
	 * `internal` components install only as transitive dependencies of
	 * other components and cannot be addressed as install targets.
	 */
	visibility: ManifestVisibility;
	/**
	 * Files the CLI copies into the consumer project, relative to the
	 * sivir root. Includes underscore-prefixed files (e.g. `_state.ts`)
	 * that are installed as part of the component but not separately
	 * addressable.
	 */
	files: string[];
	/**
	 * Other sivir components the CLI auto-pulls. Exact-version pins per
	 * pattern guide Sec.4.4 (no ranges).
	 */
	components: string[];
	/**
	 * Shared modules the CLI installs alongside the component. Two forms:
	 * - `utils.<symbol>` -- the named symbol from `utils.ts`.
	 * - `<module>` -- a top-level shared module, e.g. `transition` or `is-dark`.
	 */
	shared: string[];
	/**
	 * npm peer dependencies the consumer must have installed. The CLI
	 * warns if a peer is missing.
	 */
	peerDependencies: Record<string, string>;
	/** Optional human-readable summary surfaced by CLI listing. */
	description?: string;
	/** Optional WAI-ARIA role(s) the component implements (informational). */
	role?: string | string[];
	/** Optional test-tier marker (`tier-1` | `tier-2` | `tier-3`). */
	tier?: 'tier-1' | 'tier-2' | 'tier-3';
};
