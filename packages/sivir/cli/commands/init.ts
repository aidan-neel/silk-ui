import * as clack from '@clack/prompts';
import { existsSync } from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { CONFIG_FILE, DEFAULT_CONFIG, loadConfig, saveConfig } from '../config';
import { BASE_PEER_DEPENDENCIES, loadRegistryIndex } from '../registry';
import {
    declaredDependencies,
    detectPackageManager,
    installCommand,
    installFile
} from '../utils/project';
import { ok, warn } from '../utils/ui';

export type InitOptions = {
    cwd: string;
    yes: boolean;
};

/** Shared files every sivir project needs before any component lands. */
export async function baseFiles() {
    const index = await loadRegistryIndex();
    const files = new Set<string>(['ui.css']);
    for (const component of index.components) {
        for (const file of component.sharedFiles) files.add(file);
    }
    return [...files].sort();
}

export async function init(options: InitOptions) {
    const { cwd, yes } = options;

    clack.intro(pc.bgMagenta(pc.black(' sivir init ')));

    if (await loadConfig(cwd)) {
        clack.outro(
            `${CONFIG_FILE} already exists -- run ${pc.cyan('sivir add <component>')} instead.`
        );
        return;
    }

    const isSvelte =
        existsSync(path.join(cwd, 'svelte.config.js')) ||
        existsSync(path.join(cwd, 'svelte.config.ts')) ||
        (existsSync(path.join(cwd, 'src', 'routes')) &&
            existsSync(path.join(cwd, 'vite.config.ts')));
    if (!isSvelte) {
        warn(`no svelte.config.js found in ${cwd} -- sivir targets Svelte 5 + SvelteKit projects.`);
    }

    let dir = DEFAULT_CONFIG.dir;
    let alias = DEFAULT_CONFIG.alias;
    if (!yes) {
        const dirAnswer = await clack.text({
            message: 'Where should sivir components live?',
            defaultValue: DEFAULT_CONFIG.dir,
            placeholder: DEFAULT_CONFIG.dir
        });
        if (clack.isCancel(dirAnswer)) {
            clack.cancel('init cancelled.');
            return;
        }
        dir = dirAnswer || DEFAULT_CONFIG.dir;

        const aliasAnswer = await clack.text({
            message: 'Import alias for that directory?',
            defaultValue: DEFAULT_CONFIG.alias,
            placeholder: DEFAULT_CONFIG.alias
        });
        if (clack.isCancel(aliasAnswer)) {
            clack.cancel('init cancelled.');
            return;
        }
        alias = aliasAnswer || DEFAULT_CONFIG.alias;
    }

    const config = { ...DEFAULT_CONFIG, dir, alias, components: {} };

    const spinner = clack.spinner();
    spinner.start('Installing theme tokens and shared utilities');
    for (const file of await baseFiles()) {
        await installFile(cwd, dir, file, alias, false);
    }
    await saveConfig(cwd, config);
    spinner.stop(
        `Installed ${pc.cyan(`${dir}/ui.css`)}, utils, shared modules, and ${CONFIG_FILE}`
    );

    const declared = await declaredDependencies(cwd);
    const missing = BASE_PEER_DEPENDENCIES.filter((dep) => !declared.has(dep));
    if (missing.length > 0) {
        const pm = detectPackageManager(cwd);
        warn(`missing peer dependencies: ${missing.map((d) => pc.yellow(d)).join(', ')}`);
        console.log(`  install with ${pc.cyan(installCommand(pm, missing))}`);
    }

    ok(`import ${pc.cyan(`${dir}/ui.css`)} in your root layout or app stylesheet.`);
    clack.outro(
        `Ready -- run ${pc.cyan('sivir add button')} to install a component, or ${pc.cyan('sivir add *')} for all components.`
    );
}
