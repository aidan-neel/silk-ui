/**
 * Registry artifact types.
 *
 * `scripts/build-registry.ts` snapshots every component manifest from
 * `packages/sivir` into `registry/index.json` (this shape) plus the raw
 * source files under `registry/files/`. The published CLI ships that
 * snapshot so `sivir add` works without a server.
 */

export type RegistryComponent = {
	name: string;
	version: string;
	visibility: 'public' | 'internal';
	description?: string;
	/** Paths relative to the sivir source root (e.g. `components/button/button.svelte`). */
	files: string[];
	/** Other sivir components this one pulls in transitively. */
	components: string[];
	/** `utils.<symbol>` or `<module>` shared dependencies. */
	shared: string[];
	/** `shared` entries resolved to source files at snapshot time. */
	sharedFiles: string[];
	/** npm packages the consumer project must have installed. */
	peerDependencies: Record<string, string>;
};

export type RegistryIndex = {
	/** Version of the @sivir/ui package the snapshot was built with. */
	cliVersion: string;
	builtAt: string;
	components: RegistryComponent[];
};

export type RegistryTheme = {
	slug: string;
	name: string;
	description?: string;
	css: string;
};

/** Shape of `sivir.json` in the consumer project root. */
export type SivirConfig = {
	$schema?: string;
	/** Directory sivir source is installed into, relative to project root. */
	dir: string;
	/** Import alias that replaces `@sivir/ui` in installed files. */
	alias: string;
	/** Theme registry API base URL used by `sivir add theme <slug>`. */
	registry: string;
	/** Installed components and their versions, maintained by `sivir add`. */
	components: Record<string, string>;
};
