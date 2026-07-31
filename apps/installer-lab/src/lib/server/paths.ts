import { existsSync } from 'node:fs';
import { mkdir, realpath, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));

function findRepositoryRoot(start: string) {
	let directory = path.resolve(start);
	while (directory !== path.dirname(directory)) {
		if (
			existsSync(path.join(directory, 'packages', 'sivir', 'package.json')) &&
			existsSync(path.join(directory, 'apps', 'docs'))
		) {
			return directory;
		}
		directory = path.dirname(directory);
	}
	throw new Error(`Could not locate the Sivir repository above ${start}`);
}

export const repoRoot = findRepositoryRoot(moduleDirectory);
export const labTempRoot = path.join(repoRoot, 'temp', 'installer-lab');
export const currentRoot = path.join(labTempRoot, 'current');
export const manualRoot = path.join(labTempRoot, 'manual');
export const manualConsumerRoot = path.join(manualRoot, 'consumer');
export const manualStagingRoot = path.join(manualRoot, 'staging');
export const manualTarballPath = path.join(manualStagingRoot, 'sivir-ui.tgz');
export const terminalSnapshotPath = path.join(manualRoot, 'terminal.json');
export const terminalLogPath = path.join(manualRoot, 'terminal.log');
export const consumerRoot = path.join(currentRoot, 'consumer');
export const stagingRoot = path.join(currentRoot, 'staging');
export const artifactRoot = path.join(stagingRoot, 'node_modules', '@sivir-ui', 'svelte');
export const docsComponentsRoot = path.join(
	repoRoot,
	'apps',
	'docs',
	'src',
	'routes',
	'docs',
	'components'
);
export const snapshotPath = path.join(currentRoot, 'run.json');
export const logPath = path.join(currentRoot, 'run.log');

export function assertInsideLab(candidate: string) {
	const relative = path.relative(labTempRoot, path.resolve(candidate));
	if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
		throw new Error(`Refusing unsafe installer-lab path: ${candidate}`);
	}
	return path.resolve(candidate);
}

export async function ensureCurrentRoot() {
	await mkdir(currentRoot, { recursive: true });
	const resolvedTemp = await realpath(labTempRoot);
	const resolvedCurrent = await realpath(currentRoot);
	if (path.relative(resolvedTemp, resolvedCurrent).startsWith('..')) {
		throw new Error(`Installer workspace escaped its temp root: ${resolvedCurrent}`);
	}
}

export async function removeDisposableWorkspace(candidate = currentRoot) {
	const safePath = assertInsideLab(candidate);
	await rm(safePath, { recursive: true, force: true, maxRetries: 3 });
}
