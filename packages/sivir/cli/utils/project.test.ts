import { afterEach, describe, expect, test } from 'bun:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { declaredDependencies, detectPackageManager, installFile } from './project';

const tempDirs: string[] = [];

async function tempDir() {
	const dir = await mkdtemp(path.join(tmpdir(), 'sivir-project-'));
	tempDirs.push(dir);
	return dir;
}

afterEach(async () => {
	await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('detectPackageManager', () => {
	for (const [file, expected] of [
		['bun.lock', 'bun'],
		['bun.lockb', 'bun'],
		['pnpm-lock.yaml', 'pnpm'],
		['yarn.lock', 'yarn']
	] as const) {
		test(`detects ${expected} from ${file}`, async () => {
			const cwd = await tempDir();
			await writeFile(path.join(cwd, file), '');
			expect(detectPackageManager(cwd)).toBe(expected);
		});
	}

	test('defaults to npm without a recognized lockfile', async () => {
		expect(detectPackageManager(await tempDir())).toBe('npm');
	});
});

describe('declaredDependencies', () => {
	test('unions dependencies, devDependencies, and peerDependencies', async () => {
		const cwd = await tempDir();
		await writeFile(
			path.join(cwd, 'package.json'),
			JSON.stringify({
				dependencies: { svelte: '^5' },
				devDependencies: { tailwindcss: '^4' },
				peerDependencies: { cnfast: '^0.0.8' }
			})
		);

		expect(await declaredDependencies(cwd)).toEqual(new Set(['svelte', 'tailwindcss', 'cnfast']));
	});

	test('returns an empty set for a missing package.json', async () => {
		expect(await declaredDependencies(await tempDir())).toEqual(new Set());
	});

	test('returns an empty set for malformed package.json', async () => {
		const cwd = await tempDir();
		await writeFile(path.join(cwd, 'package.json'), '{ invalid json');
		expect(await declaredDependencies(cwd)).toEqual(new Set());
	});
});

describe('installFile', () => {
	test('creates nested files and rewrites package imports', async () => {
		const cwd = await tempDir();
		const result = await installFile(
			cwd,
			'src/lib/sivir',
			'components/button/button.svelte',
			'$lib/sivir',
			false
		);
		const source = await readFile(
			path.join(cwd, 'src/lib/sivir/components/button/button.svelte'),
			'utf8'
		);

		expect(result).toBe('created');
		expect(source).toContain('$lib/sivir');
		expect(source).not.toContain('@sivir-ui/svelte');
	});

	test('leaves an existing file untouched unless overwrite is enabled', async () => {
		const cwd = await tempDir();
		const target = path.join(cwd, 'src/lib/sivir/components/button/button.svelte');
		await mkdir(path.dirname(target), { recursive: true });
		await writeFile(target, '// consumer-owned\n');

		expect(
			await installFile(
				cwd,
				'src/lib/sivir',
				'components/button/button.svelte',
				'$lib/sivir',
				false
			)
		).toBe('skipped');
		expect(await readFile(target, 'utf8')).toBe('// consumer-owned\n');

		expect(
			await installFile(cwd, 'src/lib/sivir', 'components/button/button.svelte', '$lib/sivir', true)
		).toBe('overwritten');
		expect(await readFile(target, 'utf8')).not.toBe('// consumer-owned\n');
	});

	test('rejects traversal and absolute registry paths', async () => {
		const cwd = await tempDir();
		expect(
			installFile(cwd, 'src/lib/sivir', '../../evil.txt', '$lib/sivir', false)
		).rejects.toThrow('unsafe registry file path');
		expect(
			installFile(cwd, 'src/lib/sivir', path.join(tmpdir(), 'evil.txt'), '$lib/sivir', false)
		).rejects.toThrow('unsafe registry file path');
	});
});
