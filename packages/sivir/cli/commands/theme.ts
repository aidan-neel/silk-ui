import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as clack from '@clack/prompts';
import pc from 'picocolors';
import { parseTheme, type Theme, themeToCss } from '../../../sivir/src/themes/theme';
import { CONFIG_FILE, loadConfig } from '../config';
import { loadRegistryThemes } from '../registry';
import { fail, ok } from '../utils/ui';

export type ThemeOptions = {
    cwd: string;
};

/** Resolves a slug to theme CSS -- built-in presets first, registry after. */
export async function resolveThemeCss(slug: string, registry: string) {
    const builtin = (await loadRegistryThemes()).find((theme) => theme.slug === slug);
    if (builtin) return { css: builtin.css, source: 'built-in preset' };

    const url = `${registry.replace(/\/+$/, '')}/themes/${slug}`;
    let response: Response;
    try {
        response = await fetch(url);
    } catch {
        throw new Error(`theme registry unreachable at ${url}`);
    }
    if (response.status === 404) {
        throw new Error(`no theme "${slug}" in the registry -- browse https://sivir.dev/themes`);
    }
    if (!response.ok) {
        throw new Error(`theme registry responded ${response.status} for ${url}`);
    }
    let theme: Theme;
    try {
        theme = parseTheme(await response.json());
    } catch (error) {
        throw new Error(
            `theme registry returned an invalid theme for "${slug}": ${error instanceof Error ? error.message : String(error)}`
        );
    }
    return { css: themeToCss(theme), source: 'registry' };
}

export async function addTheme(slug: string, options: ThemeOptions) {
    const { cwd } = options;

    const config = await loadConfig(cwd);
    if (!config) {
        fail(`no ${CONFIG_FILE} found -- run ${pc.cyan('sivir init')} first.`);
        process.exitCode = 1;
        return;
    }

    clack.intro(pc.bgMagenta(pc.black(' sivir add theme ')));
    const spinner = clack.spinner();
    spinner.start(`Resolving theme ${pc.cyan(slug)}`);

    let resolved: Awaited<ReturnType<typeof resolveThemeCss>>;
    try {
        resolved = await resolveThemeCss(slug, config.registry);
    } catch (error) {
        spinner.stop('Theme resolution failed', 1);
        fail(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
        return;
    }

    const target = path.join(cwd, config.dir, 'theme.css');
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `/* sivir theme: ${slug} */\n${resolved.css}\n`);
    spinner.stop(`Fetched ${pc.cyan(slug)} (${resolved.source})`);

    ok(`wrote ${pc.cyan(path.join(config.dir, 'theme.css'))}`);
    console.log(`  import it ${pc.bold('after')} ${pc.cyan(`${config.dir}/ui.css`)} so it wins.`);
    clack.outro('Theme installed.');
}
