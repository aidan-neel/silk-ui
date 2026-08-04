import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SivirConfig } from './types';

export const CONFIG_FILE = 'sivir.json';

export const DEFAULT_CONFIG: SivirConfig = {
    dir: 'src/lib/sivir',
    alias: '$lib/sivir',
    registry: 'https://registry.sivir.dev',
    components: {}
};

export function configPath(cwd: string) {
    return path.join(cwd, CONFIG_FILE);
}

/** Reads sivir.json from the project root, or null when not initialized. */
export async function loadConfig(cwd: string): Promise<SivirConfig | null> {
    const file = configPath(cwd);
    if (!existsSync(file)) return null;
    const parsed = JSON.parse(await readFile(file, 'utf8')) as Partial<SivirConfig>;
    return { ...DEFAULT_CONFIG, ...parsed, components: parsed.components ?? {} };
}

export async function saveConfig(cwd: string, config: SivirConfig) {
    await writeFile(configPath(cwd), `${JSON.stringify(config, null, '\t')}\n`);
}
