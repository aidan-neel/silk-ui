/**
 * Snapshots the sivir component registry into `registry/`.
 *
 * Run with bun from packages/sivir (`bun run build:registry`). Imports every
 * `manifest.ts` under packages/sivir/src/components, validates that the
 * files each manifest references exist, then writes:
 *
 *   registry/index.json   -- RegistryIndex consumed by the CLI at runtime
 *   registry/files/**     -- raw component/shared sources, paths preserved
 *   registry/themes.json  -- built-in theme presets pre-rendered to CSS
 */

import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RegistryIndex, RegistryTheme } from '../cli/types';
import pkg from '../package.json';
import type { Manifest } from '../src/_manifest/types';
import { builtInThemePresets } from '../src/themes/builtin-presets';
import { themeToCss } from '../src/themes/theme';

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sivirSrc = path.resolve(pkgRoot, 'src');
const outDir = path.join(pkgRoot, 'registry');

async function collectManifestPaths() {
    const componentsDir = path.join(sivirSrc, 'components');
    const result: string[] = [];
    for (const entry of await readdir(componentsDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (entry.name === '_internal') {
            for (const inner of await readdir(path.join(componentsDir, entry.name), {
                withFileTypes: true
            })) {
                if (!inner.isDirectory()) continue;
                const manifest = path.join(componentsDir, entry.name, inner.name, 'manifest.ts');
                if (existsSync(manifest)) result.push(manifest);
            }
            continue;
        }
        const manifest = path.join(componentsDir, entry.name, 'manifest.ts');
        if (existsSync(manifest)) result.push(manifest);
    }
    return result.sort();
}

/** Resolves a manifest `shared` entry to source files relative to sivir src. */
function sharedToFiles(entry: string): string[] {
    if (entry.startsWith('utils.')) return ['utils.ts'];
    for (const candidate of [`${entry}.ts`, `${entry}.svelte.ts`]) {
        if (existsSync(path.join(sivirSrc, candidate))) return [candidate];
    }
    throw new Error(`shared entry "${entry}" resolves to no file under ${sivirSrc}`);
}

async function buildThemes(): Promise<RegistryTheme[]> {
    return builtInThemePresets.map((theme) => ({
        slug: theme.slug,
        name: theme.name,
        description: theme.description,
        css: themeToCss(theme)
    }));
}

const manifests: Manifest[] = [];
for (const manifestPath of await collectManifestPaths()) {
    const module = (await import(manifestPath)) as { manifest: Manifest };
    if (!module.manifest?.name) throw new Error(`${manifestPath} exports no manifest`);
    manifests.push(module.manifest);
}

const fileSet = new Set<string>(['ui.css']);
const known = new Set(manifests.map((m) => m.name));
for (const manifest of manifests) {
    for (const dep of manifest.components) {
        if (!known.has(dep)) {
            throw new Error(`${manifest.name} depends on unknown component "${dep}"`);
        }
    }
    for (const file of manifest.files) fileSet.add(file);
    for (const entry of manifest.shared) {
        sharedToFiles(entry).forEach((file) => {
            fileSet.add(file);
        });
    }
}

for (const file of fileSet) {
    if (!existsSync(path.join(sivirSrc, file))) {
        throw new Error(`registry references missing file: ${file}`);
    }
}

await rm(outDir, { recursive: true, force: true });
for (const file of fileSet) {
    const target = path.join(outDir, 'files', file);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(sivirSrc, file), target);
}

const index: RegistryIndex = {
    cliVersion: pkg.version,
    builtAt: new Date().toISOString(),
    components: manifests.map(
        ({
            name,
            version,
            visibility,
            description,
            files,
            components,
            shared,
            peerDependencies
        }) => ({
            name,
            version,
            visibility,
            description,
            files,
            components,
            shared,
            sharedFiles: [...new Set(shared.flatMap(sharedToFiles))],
            peerDependencies
        })
    )
};

await writeFile(path.join(outDir, 'index.json'), `${JSON.stringify(index, null, '\t')}\n`);
await writeFile(
    path.join(outDir, 'themes.json'),
    `${JSON.stringify(await buildThemes(), null, '\t')}\n`
);

console.log(`registry: ${index.components.length} components, ${fileSet.size} files, themes built`);
