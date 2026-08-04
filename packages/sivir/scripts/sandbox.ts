/**
 * sivir CLI sandbox -- verifies the CLI works by running the built `sivir` binary
 * against a throwaway, SvelteKit-shaped project under the gitignored `.sandbox/`.
 * For CLI developers; not shipped to library users (scripts/ is outside the
 * published `files`).
 *
 *   bun run sandbox                  # build, then run the full check suite
 *   bun run sandbox run add button   # run one sivir command in the sandbox app
 *   bun run sandbox reset [--bare]   # recreate the app (bare = omit peer deps)
 *   bun run sandbox clean            # delete the sandbox
 *
 * Prepend --no-build to skip rebuilding the CLI first (`bun run sandbox --no-build`).
 *
 * The check suite exercises every command and guard by invoking the real binary
 * against a fresh install and asserting on the result; it exits non-zero if any
 * check fails. Use `run` to reproduce a failing command interactively.
 */

import { spawnSync } from 'node:child_process';
import {
    closeSync,
    existsSync,
    mkdirSync,
    openSync,
    readFileSync,
    rmSync,
    writeFileSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { gradientLine } from '../cli/utils/ui';
import pkg from '../package.json';

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distEntry = path.join(cliRoot, 'dist/index.js');
const sandboxRoot = path.join(cliRoot, '.sandbox');
const appDir = path.join(sandboxRoot, 'app');

/** Directory `sivir init` installs into by default; checks assert against it. */
const SIVIR = 'src/lib/sivir';

/** Framework-level peers a real consumer project would already have. */
const FRAMEWORK_PEERS: Record<string, string> = {
    svelte: '^5.0.0',
    tailwindcss: '^4.0.0'
};

/** Component-level peers sivir pulls; omitted by `--bare` so the missing-peer
 * warning path can be exercised. */
const COMPONENT_PEERS: Record<string, string> = {
    cnfast: '^0.0.8',
    'tailwind-merge': '^3.0.0',
    'tailwind-variants': '^3.0.0',
    '@floating-ui/dom': '^1.0.0',
    '@lucide/svelte': '^1.0.0',
    'fuse.js': '^7.0.0'
};

function header(text: string) {
    console.log();
    console.log(`  ${gradientLine(text)}`);
    console.log();
}

const dim = (message: string) => console.log(pc.dim(`  ${message}`));

/** (Re)writes the sandbox app from scratch. */
function createApp(bare: boolean) {
    rmSync(appDir, { recursive: true, force: true });
    mkdirSync(path.join(appDir, 'src/lib'), { recursive: true });
    mkdirSync(path.join(appDir, 'src/routes'), { recursive: true });

    const devDependencies = bare
        ? { ...FRAMEWORK_PEERS }
        : { ...FRAMEWORK_PEERS, ...COMPONENT_PEERS };

    writeFileSync(
        path.join(appDir, 'package.json'),
        `${JSON.stringify(
            {
                name: 'sivir-sandbox-app',
                private: true,
                type: 'module',
                version: '0.0.0',
                devDependencies
            },
            null,
            '\t'
        )}\n`
    );

    // `sivir init` only checks that this file exists -- the sandbox exercises the
    // install flow, not a running SvelteKit app, so the fixture stays empty.
    writeFileSync(
        path.join(appDir, 'svelte.config.js'),
        '/** Fixture for the sivir CLI sandbox -- its presence satisfies `sivir init`. */\nexport default {};\n'
    );

    // Empty lockfile so the CLI detects bun as the package manager.
    writeFileSync(path.join(appDir, 'bun.lock'), '');

    writeFileSync(
        path.join(appDir, 'src/app.css'),
        [
            '/* sivir token system -- available after `sivir init`. */',
            "@import './lib/sivir/ui.css';",
            '/* Theme overrides -- available after `sivir add theme <slug>`: */',
            "/* @import './lib/sivir/theme.css'; */",
            ''
        ].join('\n')
    );

    writeFileSync(
        path.join(appDir, 'README.md'),
        [
            '# sivir CLI sandbox (generated)',
            '',
            'Ephemeral SvelteKit-shaped project for exercising the local `sivir` build.',
            'Created and reset by `packages/sivir/scripts/sandbox.ts`; everything under',
            '`.sandbox/` is gitignored. Edits here are disposable -- `bun run sandbox reset`',
            'recreates it from scratch.',
            ''
        ].join('\n')
    );
}

function ensureApp() {
    if (!existsSync(appDir)) {
        createApp(false);
        dim(`scaffolded a fresh app at ${path.relative(cliRoot, appDir)}`);
    }
}

function buildCli(noBuild: boolean) {
    if (noBuild) {
        if (!existsSync(distEntry)) {
            console.error(
                pc.red(`✖ ${path.relative(cliRoot, distEntry)} is missing -- drop --no-build.`)
            );
            process.exit(1);
        }
        return;
    }
    const result = spawnSync('bun', ['run', 'build'], { cwd: cliRoot, stdio: 'inherit' });
    if (result.status !== 0) {
        console.error(pc.red('✖ CLI build failed.'));
        process.exit(result.status ?? 1);
    }
}

// --- check suite: run the real binary, capture output, assert ---------------

/** Runs `sivir` in the sandbox app and captures combined output (no TTY, so the
 * CLI never prompts -- it takes the non-interactive branch everywhere). */
function sivir(args: string[]): { status: number; out: string } {
    const outputFile = path.join(sandboxRoot, '.command-output');
    mkdirSync(sandboxRoot, { recursive: true });
    const output = openSync(outputFile, 'w');
    let result: ReturnType<typeof spawnSync>;
    try {
        // Bun 1.3 can drop output when a Bun process captures a nested Node
        // process through pipes. A real file descriptor keeps this a Node-runtime
        // CLI test while preserving output for assertions.
        result = spawnSync('node', [distEntry, ...args], {
            cwd: appDir,
            stdio: ['ignore', output, output]
        });
    } finally {
        closeSync(output);
    }
    const out = readFileSync(outputFile, 'utf8');
    rmSync(outputFile, { force: true });
    return { status: result.status ?? 1, out };
}

const exists = (rel: string) => existsSync(path.join(appDir, rel));
const read = (rel: string) => readFileSync(path.join(appDir, rel), 'utf8');
const config = () =>
    JSON.parse(read('sivir.json')) as { components?: Record<string, string> } & Record<
        string,
        unknown
    >;

/** Fresh app + `sivir init -y`; returns the init result for assertions. */
function initApp(bare = false) {
    createApp(bare);
    return sivir(['init', '-y']);
}

type Check = { label: string; run: () => string[] };

const CHECKS: Check[] = [
    {
        label: 'init bootstraps sivir.json + base files',
        run: () => {
            const f: string[] = [];
            const r = initApp();
            if (r.status !== 0) f.push(`init exited ${r.status}`);
            for (const file of [
                'sivir.json',
                `${SIVIR}/ui.css`,
                `${SIVIR}/utils.ts`,
                `${SIVIR}/transition.ts`
            ]) {
                if (!exists(file)) f.push(`missing ${file}`);
            }
            if (exists('sivir.json')) {
                const cfg = config();
                if (cfg.dir !== 'src/lib/sivir') f.push(`sivir.json dir = ${String(cfg.dir)}`);
                if (cfg.alias !== '$lib/sivir') f.push(`sivir.json alias = ${String(cfg.alias)}`);
                if (!cfg.registry) f.push('sivir.json missing registry');
            }
            return f;
        }
    },
    {
        label: 'init guards against re-initialising',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['init', '-y']);
            if (r.status !== 0) f.push(`second init exited ${r.status}`);
            if (!r.out.includes('already exists')) f.push('no "already exists" notice');
            return f;
        }
    },
    {
        label: 'add installs files, rewrites imports, records version',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['add', 'button']);
            if (r.status !== 0) f.push(`add button exited ${r.status}`);
            for (const file of ['button.svelte', 'index.ts', 'variants.ts']) {
                if (!exists(`${SIVIR}/components/button/${file}`)) f.push(`missing button/${file}`);
            }
            if (exists(`${SIVIR}/components/button/button.svelte`)) {
                const src = read(`${SIVIR}/components/button/button.svelte`);
                if (!src.includes('$lib/sivir')) f.push('imports not rewritten to alias');
                if (src.includes('@sivir-ui/svelte'))
                    f.push('stale @sivir-ui/svelte import remains');
            }
            if (!config().components?.button) f.push('sivir.json did not record button');
            return f;
        }
    },
    {
        label: 'add resolves transitive deps (command → modal, button)',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['add', 'command']);
            if (r.status !== 0) f.push(`add command exited ${r.status}`);
            for (const name of ['command', 'modal', 'button']) {
                if (!exists(`${SIVIR}/components/${name}`)) f.push(`missing component dir ${name}`);
                if (!config().components?.[name]) f.push(`sivir.json missing ${name}`);
            }
            return f;
        }
    },
    {
        label: 'add pulls internal deps (modal → _internal/overlay)',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['add', 'modal']);
            if (r.status !== 0) f.push(`add modal exited ${r.status}`);
            if (!exists(`${SIVIR}/components/_internal/overlay/overlay.svelte.ts`)) {
                f.push('internal overlay not installed');
            }
            if (!exists(`${SIVIR}/components/modal/modal.svelte`)) f.push('modal not installed');
            return f;
        }
    },
    {
        label: 'add accepts multiple components at once',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['add', 'accordion', 'badge']);
            if (r.status !== 0) f.push(`add exited ${r.status}`);
            for (const name of ['accordion', 'badge']) {
                if (!config().components?.[name]) f.push(`sivir.json missing ${name}`);
            }
            return f;
        }
    },
    {
        label: 'add is idempotent (re-add skips existing)',
        run: () => {
            const f: string[] = [];
            initApp();
            sivir(['add', 'button']);
            const r = sivir(['add', 'button']);
            if (r.status !== 0) f.push(`re-add exited ${r.status}`);
            if (!r.out.includes('already existed')) f.push('no skip notice on re-add');
            return f;
        }
    },
    {
        label: 'add --overwrite replaces modified files',
        run: () => {
            const f: string[] = [];
            initApp();
            sivir(['add', 'button']);
            const target = `${SIVIR}/components/button/button.svelte`;
            writeFileSync(path.join(appDir, target), '// tampered\n');
            const r = sivir(['add', 'button', '--overwrite']);
            if (r.status !== 0) f.push(`overwrite exited ${r.status}`);
            const src = exists(target) ? read(target) : '';
            if (src.includes('// tampered')) f.push('file not overwritten');
            if (!src.includes('$lib/sivir')) f.push('overwritten file missing rewritten imports');
            return f;
        }
    },
    {
        label: 'add before init fails with guidance',
        run: () => {
            const f: string[] = [];
            createApp(false); // deliberately skip init
            const r = sivir(['add', 'button']);
            if (r.status === 0) f.push('expected non-zero exit');
            if (!r.out.includes('sivir init')) f.push('no "sivir init" guidance');
            return f;
        }
    },
    {
        label: 'unknown component suggests the closest match',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['add', 'buton']);
            if (r.status === 0) f.push('expected non-zero exit');
            if (!r.out.includes('did you mean')) f.push('no suggestion offered');
            if (!r.out.includes('button')) f.push('did not suggest "button"');
            return f;
        }
    },
    {
        label: 'internal component rejected as a direct target',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['add', '_internal/overlay']);
            if (r.status === 0) f.push('expected non-zero exit');
            if (!r.out.includes('internal')) f.push('no "internal" explanation');
            return f;
        }
    },
    {
        label: 'add theme default resolves offline',
        run: () => {
            const f: string[] = [];
            initApp();
            const r = sivir(['add', 'theme', 'default']);
            if (r.status !== 0) f.push(`add theme exited ${r.status}`);
            if (!exists(`${SIVIR}/theme.css`)) f.push('theme.css not written');
            else if (!read(`${SIVIR}/theme.css`).includes(':root'))
                f.push('theme.css missing :root');
            return f;
        }
    },
    {
        label: 'list shows components and themes',
        run: () => {
            const f: string[] = [];
            const r = sivir(['list']);
            if (r.status !== 0) f.push(`list exited ${r.status}`);
            if (!r.out.includes('button')) f.push('list missing "button"');
            if (!r.out.includes('default')) f.push('list missing "default" theme');
            return f;
        }
    },
    {
        label: '--version matches package.json',
        run: () => {
            const f: string[] = [];
            const r = sivir(['--version']);
            if (r.status !== 0) f.push(`--version exited ${r.status}`);
            if (r.out.trim() !== pkg.version) {
                f.push(`printed "${r.out.trim()}", expected ${pkg.version}`);
            }
            return f;
        }
    },
    {
        label: 'bare project reports missing peer dependencies',
        run: () => {
            const f: string[] = [];
            const r = initApp(true);
            if (r.status !== 0) f.push(`init exited ${r.status}`);
            if (!r.out.includes('missing peer dependencies')) f.push('no missing-peer warning');
            return f;
        }
    }
];

function verify(noBuild: boolean) {
    buildCli(noBuild);
    header('sivir sandbox · verify');
    dim(`running ${CHECKS.length} checks against ${path.relative(cliRoot, appDir)}`);
    console.log();

    let failed = 0;
    for (const check of CHECKS) {
        const failures = check.run();
        if (failures.length === 0) {
            console.log(`  ${pc.green('✔')} ${check.label}`);
        } else {
            failed++;
            console.log(`  ${pc.red('✖')} ${check.label}`);
            for (const failure of failures) console.log(`    ${pc.red(failure)}`);
        }
    }

    console.log();
    if (failed > 0) {
        console.log(`  ${pc.red(`${failed} of ${CHECKS.length} checks failed`)}`);
        dim('reproduce a command with: bun run sandbox run <args>');
        process.exit(1);
    }
    console.log(`  ${pc.green(`all ${CHECKS.length} checks passed`)}`);
}

/** Runs one sivir command against the persistent sandbox app, for debugging. */
function runOnce(sivirArgs: string[], noBuild: boolean) {
    if (sivirArgs.length === 0) {
        printHelp();
        process.exit(1);
    }
    buildCli(noBuild);
    ensureApp();
    process.exit(
        spawnSync('node', [distEntry, ...sivirArgs], { cwd: appDir, stdio: 'inherit' }).status ?? 1
    );
}

function printHelp() {
    header('sivir sandbox');
    console.log('  Run the local sivir build against a throwaway project and verify it works.');
    console.log();
    console.log(
        `  ${pc.cyan('bun run sandbox')}                  run the full check suite (default)`
    );
    console.log(
        `  ${pc.cyan('bun run sandbox run <args>')}       run one sivir command in the app`
    );
    console.log(
        `  ${pc.cyan('bun run sandbox reset [--bare]')}   recreate the app (bare omits peers)`
    );
    console.log(`  ${pc.cyan('bun run sandbox clean')}            delete the sandbox`);
    console.log();
    dim('prepend --no-build to skip rebuilding the CLI first');
    console.log();
}

// --- dispatch ---------------------------------------------------------------

let args = process.argv.slice(2);
let noBuild = false;
if (args[0] === '--no-build') {
    noBuild = true;
    args = args.slice(1);
}

const command = args[0];
switch (command) {
    case undefined:
    case 'verify':
        verify(noBuild);
        break;
    case 'help':
    case '--help':
    case '-h':
        printHelp();
        break;
    case 'clean':
        rmSync(sandboxRoot, { recursive: true, force: true });
        dim('removed .sandbox');
        break;
    case 'reset':
        createApp(args.includes('--bare'));
        dim(
            `reset app at ${path.relative(cliRoot, appDir)}${args.includes('--bare') ? ' (bare)' : ''}`
        );
        break;
    case 'run':
        runOnce(args.slice(1), noBuild);
        break;
    default:
        runOnce(args, noBuild);
}
