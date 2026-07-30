import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';

import packageJson from './package.json';

describe('publishable package contract', () => {
	test('declares the public package metadata used by npm', () => {
		expect(packageJson.name).toBe('@sivir/ui');
		expect(packageJson.license).toBe('MIT');
		expect(packageJson.sideEffects).toEqual(['**/*.css']);
		expect(packageJson.files).toEqual(expect.arrayContaining(['src', 'dist', 'registry']));
		expect(packageJson.bin).toEqual({ sivir: 'dist/index.js' });
		expect(packageJson.peerDependencies).toMatchObject({
			svelte: '^5.0.0',
			tailwindcss: '^4.0.0'
		});
		expect(packageJson.exports['.']).toBeTruthy();
		expect(packageJson.exports['./ui.css']).toBe('./src/ui.css');
		expect(packageJson.exports['./components/*']).toBe('./src/components/*/index.ts');
		expect(packageJson.scripts['verify:artifact']).toBeTruthy();
		expect(packageJson.scripts['verify:cli-artifact']).toBeTruthy();
		expect(packageJson.scripts.check).toContain('check:cli');
		expect(packageJson.scripts.check).toContain('check:components');
		expect(packageJson.repository).toEqual({
			type: 'git',
			url: 'git+https://github.com/aidan-neel/sivir-ui.git',
			directory: 'packages/sivir'
		});
		expect(packageJson.homepage).toBe('https://github.com/aidan-neel/sivir-ui#readme');
		expect(packageJson.bugs).toBe('https://github.com/aidan-neel/sivir-ui/issues');
		expect(packageJson.keywords).toEqual(
			expect.arrayContaining(['svelte', 'components', 'ui', 'tailwind'])
		);
	});

	/**
	 * The budget covers tokens plus the multi-component surface contracts
	 * (`.sivir-menu-item`, `.sivir-card-*`, `.sivir-tooltip*`). Those moved here
	 * out of shared TypeScript class strings, so the ceiling rose once to absorb
	 * them -- the installed surface as a whole stayed flat. Treat further growth
	 * as a signal that a component is leaking private styling into the contract.
	 */
	test('keeps distributable CSS within the public-token budget', async () => {
		const css = await readFile(new URL('./src/ui.css', import.meta.url), 'utf8');
		const privatePrefix =
			/^\s*--(?:button|badge|field|panel|card|menu|command|tooltip|switch|checkbox|toast|tabs|progress|modal|sheet|textarea|breadcrumb|toggle|shortcut|slider)-/m;

		expect(css.split('\n').length).toBeLessThanOrEqual(340);
		expect(Buffer.byteLength(css)).toBeLessThanOrEqual(12 * 1024);
		expect(css).not.toMatch(privatePrefix);
		expect(css).not.toMatch(/(^|})\s*\*\s*\{/);
		expect(css).not.toContain('@layer base');
	});

	test('keeps component animations colocated and reduced-motion safe', async () => {
		const animationFiles = [
			'./src/components/skeleton/skeleton.svelte',
			'./src/components/progress/progress.svelte',
			'./src/components/toast/toast.svelte'
		] as const;
		const source = (
			await Promise.all(
				animationFiles.map((file) => readFile(new URL(file, import.meta.url), 'utf8'))
			)
		).join('\n');

		for (const name of ['skeleton-loading', 'sivir-progress-slide', 'sivir-toast-progress']) {
			expect(source).toContain(`@keyframes ${name}`);
			expect(source.split(name)).toHaveLength(3);
		}
		for (const file of animationFiles) {
			const component = await readFile(new URL(file, import.meta.url), 'utf8');
			expect(component).toContain('motion-reduce:animate-none');
		}
	});

	test('ships only the styling runtimes required by public components', async () => {
		const tooltip = await readFile(
			new URL('./src/components/tooltip/shared-tooltip.ts', import.meta.url),
			'utf8'
		);

		expect(tooltip).not.toContain('slot-text/style.css');
		expect(packageJson.dependencies).not.toHaveProperty('slot-text');
		expect(packageJson.dependencies).toMatchObject({
			'tailwind-merge': '^3.6.0',
			'tailwind-variants': '^3.2.2'
		});
	});

	test('keeps compound component state instance-scoped', async () => {
		const files = (await readdir(new URL('./src', import.meta.url), { recursive: true })).filter(
			(file) => /\.(?:svelte|ts)$/.test(file)
		);
		const source = (
			await Promise.all(
				files.map((file) => readFile(new URL(`./src/${file}`, import.meta.url), 'utf8'))
			)
		).join('\n');

		expect(files).not.toContain('internals/state.svelte.ts');
		expect(source).not.toMatch(/\buseState\b|\bstates\s*\[/);
		expect(source).not.toMatch(/(?:set|get)Context(?:<[^>]+>)?\(['"]key['"]\)/);
	});

	test('uses only exported package paths for source self-references', async () => {
		const files = (await readdir(new URL('./src', import.meta.url), { recursive: true })).filter(
			(file) => /\.(?:svelte|ts)$/.test(file)
		);
		const source = (
			await Promise.all(
				files.map((file) => readFile(new URL(`./src/${file}`, import.meta.url), 'utf8'))
			)
		).join('\n');
		const selfReferences = [...source.matchAll(/['"](@sivir\/ui(?:\/[^'"]+)?)['"]/g)].map(
			([, specifier]) => specifier
		);
		const exportedPath =
			/^@sivir\/ui(?:\/(?:ui\.css|brand-mark|utils|transition|is-dark\.svelte\.ts|_manifest\/types|themes\/[^/]+|components\/(?:input\/variants|_internal\/overlay|[^/]+)))?$/;

		expect(selfReferences.length).toBeGreaterThan(0);
		for (const specifier of selfReferences) expect(specifier).toMatch(exportedPath);
	});

	test('ships the repository license byte-for-byte', async () => {
		const [rootLicense, packageLicense] = await Promise.all([
			readFile(new URL('../../LICENSE', import.meta.url), 'utf8'),
			readFile(new URL('./LICENSE', import.meta.url), 'utf8')
		]);

		expect(packageLicense).toBe(rootLicense);
		expect(packageLicense).not.toContain('Copyright (c) 2025 Name');
	});

	// Full barrel/catalog lock lives in public-api.test.ts (Phase 2 §1).
});
