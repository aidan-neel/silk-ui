import * as clack from '@clack/prompts';
import { spawnSync } from 'node:child_process';
import pc from 'picocolors';
import { CONFIG_FILE, loadConfig, saveConfig } from '../config';
import { ResolveError, installableFiles, loadRegistryIndex, resolveInstallPlan } from '../registry';
import {
    type CopyResult,
    declaredDependencies,
    detectPackageManager,
    installCommand,
    installFile
} from '../utils/project';
import { fail, ok, tree, warn } from '../utils/ui';

export type AddOptions = {
    cwd: string;
    yes: boolean;
    overwrite: boolean;
};

const RESULT_MARK: Record<CopyResult, string> = {
    created: pc.green('+'),
    overwritten: pc.yellow('~'),
    skipped: pc.dim('=')
};

export async function add(names: string[], options: AddOptions) {
    const { cwd, yes, overwrite } = options;

    const config = await loadConfig(cwd);
    if (!config) {
        fail(`no ${CONFIG_FILE} found -- run ${pc.cyan('sivir init')} first.`);
        process.exitCode = 1;
        return;
    }

    const index = await loadRegistryIndex();
    let plan;
    try {
        plan = resolveInstallPlan(index, names);
    } catch (error) {
        if (error instanceof ResolveError) {
            fail(error.message);
            console.log(`  run ${pc.cyan('sivir list')} to see what's available.`);
            process.exitCode = 1;
            return;
        }
        throw error;
    }

    const pulled = names.includes('*')
        ? []
        : plan.components.filter((c) => !names.includes(c.name));
    clack.intro(pc.bgMagenta(pc.black(' sivir add ')));
    if (pulled.length > 0) {
        console.log(
            `${pc.dim('│')}  pulling ${pulled.map((c) => pc.cyan(c.name)).join(', ')} as dependencies`
        );
    }

    const spinner = clack.spinner();
    spinner.start(`Installing ${plan.components.length} component(s) into ${config.dir}`);

    const summaries: { heading: string; lines: string[] }[] = [];
    let skipped = 0;
    for (const component of plan.components) {
        const lines: string[] = [];
        const files = [...installableFiles(component), ...component.sharedFiles];
        for (const file of files) {
            const result = await installFile(cwd, config.dir, file, config.alias, overwrite);
            if (result === 'skipped') skipped++;
            lines.push(`${RESULT_MARK[result]} ${file}`);
        }
        config.components[component.name] = component.version;
        summaries.push({
            heading: `${pc.bold(component.name)} ${pc.dim(`v${component.version}`)}`,
            lines
        });
    }
    await saveConfig(cwd, config);
    spinner.stop(`Installed into ${pc.cyan(config.dir)}`);

    for (const summary of summaries) tree(summary.heading, summary.lines);
    if (skipped > 0) {
        warn(
            `${skipped} file(s) already existed and were left alone -- pass --overwrite to replace.`
        );
    }

    const declared = await declaredDependencies(cwd);
    const missing = Object.keys(plan.peerDependencies).filter((dep) => !declared.has(dep));
    if (missing.length > 0) {
        const pm = detectPackageManager(cwd);
        const command = installCommand(pm, missing);
        warn(`missing peer dependencies: ${missing.map((d) => pc.yellow(d)).join(', ')}`);

        let install = yes;
        if (!yes && process.stdout.isTTY) {
            const answer = await clack.confirm({ message: `Run ${pc.cyan(command)} now?` });
            install = answer === true;
        }
        if (install) {
            const [bin, ...args] = command.split(' ');
            const result = spawnSync(bin, args, { cwd, stdio: 'inherit' });
            if (result.status === 0) ok('peer dependencies installed.');
            else warn(`"${command}" exited with ${result.status} -- install them manually.`);
        } else {
            console.log(`  install with ${pc.cyan(command)}`);
        }
    }

    clack.outro(
        `Done -- ${plan.components.length} component(s) ready under ${pc.cyan(config.alias)}.`
    );
}
