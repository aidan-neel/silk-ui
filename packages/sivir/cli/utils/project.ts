import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { registryFilePath, rewriteImports } from '../registry';

export type PackageManager = 'bun' | 'pnpm' | 'yarn' | 'npm';

export function detectPackageManager(cwd: string): PackageManager {
	if (existsSync(path.join(cwd, 'bun.lock')) || existsSync(path.join(cwd, 'bun.lockb')))
		return 'bun';
	if (existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
	if (existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
	return 'npm';
}

export function installCommand(pm: PackageManager, packages: string[]) {
	const verb = pm === 'npm' ? 'install' : 'add';
	return `${pm} ${verb} ${packages.join(' ')}`;
}

/** Dependencies declared anywhere in the consumer's package.json. */
export async function declaredDependencies(cwd: string): Promise<Set<string>> {
	const file = path.join(cwd, 'package.json');
	if (!existsSync(file)) return new Set();
	let pkg: Record<string, Record<string, unknown> | undefined>;
	try {
		pkg = JSON.parse(await readFile(file, 'utf8'));
	} catch {
		return new Set();
	}
	return new Set([
		...Object.keys(pkg.dependencies ?? {}),
		...Object.keys(pkg.devDependencies ?? {}),
		...Object.keys(pkg.peerDependencies ?? {})
	]);
}

export type CopyResult = 'created' | 'overwritten' | 'skipped';

/**
 * Copies one registry file into the consumer project, rewriting
 * `@sivir-ui/svelte` imports to the configured alias. Existing files are left
 * alone unless `overwrite` is set.
 */
export async function installFile(
	cwd: string,
	dir: string,
	file: string,
	alias: string,
	overwrite: boolean
): Promise<CopyResult> {
	const base = path.resolve(cwd, dir);
	const target = path.resolve(base, file);
	if (!target.startsWith(`${base}${path.sep}`)) {
		throw new Error(`unsafe registry file path: ${file}`);
	}
	const exists = existsSync(target);
	if (exists && !overwrite) return 'skipped';
	const source = await readFile(registryFilePath(file), 'utf8');
	await mkdir(path.dirname(target), { recursive: true });
	await writeFile(target, rewriteImports(source, alias));
	return exists ? 'overwritten' : 'created';
}
