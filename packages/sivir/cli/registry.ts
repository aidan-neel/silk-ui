import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RegistryComponent, RegistryIndex, RegistryTheme } from './types';

/** Dependencies installed by `sivir init` for shared files and theme tokens. */
export const BASE_PEER_DEPENDENCIES = ['svelte', 'tailwindcss', 'cnfast', '@floating-ui/dom'];

/**
 * The registry snapshot lives at the package root (next to dist/), so it
 * resolves from both src (bun test) and the bundled dist entry.
 */
const registryDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../registry');

export async function loadRegistryIndex(): Promise<RegistryIndex> {
    return JSON.parse(await readFile(path.join(registryDir, 'index.json'), 'utf8'));
}

export async function loadRegistryThemes(): Promise<RegistryTheme[]> {
    return JSON.parse(await readFile(path.join(registryDir, 'themes.json'), 'utf8'));
}

export function registryFilePath(file: string) {
    return path.join(registryDir, 'files', file);
}

export type InstallPlan = {
    /** Requested components plus transitive dependencies, install order. */
    components: RegistryComponent[];
    /** Union of npm peer dependencies across the plan. */
    peerDependencies: Record<string, string>;
};

/** Files `sivir add` copies for one component. Manifests are registry
 * metadata, not consumer code -- versions are tracked in sivir.json. */
export function installableFiles(component: RegistryComponent) {
    return component.files.filter((file) => path.basename(file) !== 'manifest.ts');
}

function levenshtein(a: string, b: string) {
    const rows = Array.from({ length: a.length + 1 }, (_, i) => {
        const row = new Array<number>(b.length + 1).fill(0);
        row[0] = i;
        return row;
    });
    for (let j = 0; j <= b.length; j++) rows[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            rows[i][j] = Math.min(
                rows[i - 1][j] + 1,
                rows[i][j - 1] + 1,
                rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return rows[a.length][b.length];
}

/** Closest public component name, used for typo hints. */
export function suggestComponent(index: RegistryIndex, input: string) {
    const candidates = index.components.filter((c) => c.visibility === 'public');
    let best: { name: string; distance: number } | null = null;
    for (const candidate of candidates) {
        const distance = levenshtein(input, candidate.name);
        if (!best || distance < best.distance) best = { name: candidate.name, distance };
    }
    return best && best.distance <= 3 ? best.name : null;
}

export class ResolveError extends Error {}

/**
 * Resolves requested component names into a full install plan, walking
 * transitive `components` dependencies. Requested names must be public;
 * internal components are reachable only as dependencies.
 */
export function resolveInstallPlan(index: RegistryIndex, names: string[]): InstallPlan {
    const byName = new Map(index.components.map((c) => [c.name, c]));
    const requestedNames = names.includes('*')
        ? [
              ...new Set([
                  ...names.filter((name) => name !== '*'),
                  ...index.components
                      .filter((component) => component.visibility === 'public')
                      .map((component) => component.name)
              ])
          ]
        : names;

    for (const name of requestedNames) {
        const component = byName.get(name);
        if (!component) {
            const suggestion = suggestComponent(index, name);
            throw new ResolveError(
                `unknown component "${name}"${suggestion ? ` -- did you mean "${suggestion}"?` : ''}`
            );
        }
        if (component.visibility !== 'public') {
            throw new ResolveError(
                `"${name}" is internal and installs only as a dependency of other components`
            );
        }
    }

    const resolved = new Map<string, RegistryComponent>();
    const queue = [...requestedNames];
    while (queue.length > 0) {
        const name = queue.shift();
        if (name === undefined) {
            break;
        }
        if (resolved.has(name)) continue;
        const component = byName.get(name);
        if (!component) {
            throw new ResolveError(`registry index is missing dependency "${name}"`);
        }
        resolved.set(name, component);
        queue.push(...component.components);
    }

    const peerDependencies: Record<string, string> = {};
    for (const component of resolved.values()) {
        for (const [dep, range] of Object.entries(component.peerDependencies)) {
            peerDependencies[dep] ??= range;
        }
    }

    return { components: [...resolved.values()], peerDependencies };
}

/** Rewrites `@sivir-ui/svelte/...` imports to the consumer's configured alias. */
export function rewriteImports(source: string, alias: string) {
    return source
        .replaceAll(/(['"])@sivir-ui\/svelte([^'"]*?)\.ts\1/g, `$1${alias}$2$1`)
        .replaceAll(/@sivir-ui\/svelte(?=['/])/g, alias);
}
