import type { ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { appendFile, mkdir, readFile, realpath, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stripVTControlCharacters } from 'node:util';
import type { InstallPath, RunSource } from '$lib/run-types';
import type { TerminalEvent, TerminalSnapshot } from '$lib/terminal-types';
import {
    type CommandSpec,
    commandLabel,
    consumerInstallCommand,
    scaffoldCommands,
    spawnDetached
} from './commands';
import {
    manualConsumerRoot,
    manualRoot,
    manualStagingRoot,
    manualTarballPath,
    removeDisposableWorkspace,
    repoRoot,
    terminalLogPath,
    terminalSnapshotPath
} from './paths';
import { terminateProcess } from './run-manager';
import { TerminalEventHub } from './terminal-event-hub';

const MAX_COMMAND_LENGTH = 8_000;

const initialSnapshot = (): TerminalSnapshot => ({
    cwd: repoRoot,
    running: false,
    preparing: false,
    activeCommand: null,
    startedAt: null,
    finishedAt: null,
    exitCode: null,
    signal: null,
    prepared: false,
    source: null,
    installPath: null
});

function isInsideRepository(candidate: string) {
    const relative = path.relative(repoRoot, path.resolve(candidate));
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function parseCommandLine(input: string) {
    const args: string[] = [];
    let token = '';
    let tokenStarted = false;
    let quote: 'single' | 'double' | null = null;
    let escaped = false;

    const push = () => {
        if (!tokenStarted) return;
        args.push(token);
        token = '';
        tokenStarted = false;
    };

    for (const character of input) {
        if (escaped) {
            token += character;
            tokenStarted = true;
            escaped = false;
            continue;
        }
        if (character === '\\' && quote !== 'single') {
            escaped = true;
            tokenStarted = true;
            continue;
        }
        if (quote === 'single') {
            if (character === "'") quote = null;
            else token += character;
            continue;
        }
        if (quote === 'double') {
            if (character === '"') quote = null;
            else token += character;
            continue;
        }
        if (character === "'") {
            quote = 'single';
            tokenStarted = true;
            continue;
        }
        if (character === '"') {
            quote = 'double';
            tokenStarted = true;
            continue;
        }
        if (/\s/.test(character)) {
            push();
            continue;
        }
        if ('|&;<>()'.includes(character)) {
            throw new Error(
                `Shell operator "${character}" is not supported. Run one command at a time.`
            );
        }
        token += character;
        tokenStarted = true;
    }

    if (escaped) throw new Error('The command ends with an unfinished escape.');
    if (quote) throw new Error('The command has an unterminated quote.');
    push();
    if (args.length === 0) throw new Error('Enter a command first.');
    return args;
}

export class TerminalManager {
    private snapshot = initialSnapshot();
    private rawLog = '';
    private initialized = false;
    private initializePromise: Promise<void> | null = null;
    private activeProcess: ChildProcess | null = null;
    private activeCompletion: Promise<void> | null = null;
    private activePreparation: Promise<void> | null = null;
    private preparationCancelled = false;
    private eventHub = new TerminalEventHub(this.snapshot);

    constructor() {
        process.once('exit', () => {
            const child = this.activeProcess;
            if (!child?.pid) return;
            try {
                if (process.platform === 'win32') child.kill('SIGTERM');
                else process.kill(-child.pid, 'SIGTERM');
            } catch {
                // The command already exited.
            }
        });
    }

    async initialize() {
        if (this.initialized) return;
        if (this.initializePromise) return this.initializePromise;
        this.initializePromise = this.restore();
        await this.initializePromise;
        this.initialized = true;
    }

    private async ensureWorkspace() {
        await mkdir(manualStagingRoot, { recursive: true });
        const packagePath = path.join(manualStagingRoot, 'package.json');
        if (!existsSync(packagePath)) {
            await writeFile(
                packagePath,
                JSON.stringify({ name: 'installer-lab-manual-stage', private: true }, null, '\t') +
                    '\n'
            );
        }
    }

    private async restore() {
        await this.ensureWorkspace();
        if (existsSync(terminalSnapshotPath)) {
            try {
                const restored = JSON.parse(
                    await readFile(terminalSnapshotPath, 'utf8')
                ) as TerminalSnapshot;
                this.snapshot = {
                    ...initialSnapshot(),
                    ...restored,
                    running: false,
                    preparing: false,
                    activeCommand: null,
                    cwd:
                        existsSync(restored.cwd) && isInsideRepository(restored.cwd)
                            ? restored.cwd
                            : repoRoot
                };
            } catch {
                this.snapshot = initialSnapshot();
            }
        }
        this.rawLog = existsSync(terminalLogPath) ? await readFile(terminalLogPath, 'utf8') : '';
        await this.persistSnapshot();
        this.eventHub.seed(this.currentSnapshot(), this.rawLog);
    }

    private currentSnapshot() {
        return { ...this.snapshot };
    }

    async getSnapshot() {
        await this.initialize();
        return this.currentSnapshot();
    }

    getLog() {
        return this.rawLog;
    }

    subscribe(callback: (event: TerminalEvent) => void) {
        return this.eventHub.subscribe(callback);
    }

    private async persistSnapshot() {
        await this.ensureWorkspace();
        await writeFile(terminalSnapshotPath, `${JSON.stringify(this.snapshot, null, '\t')}\n`);
    }

    private async patchSnapshot(patch: Partial<TerminalSnapshot>) {
        this.snapshot = { ...this.snapshot, ...patch };
        await this.persistSnapshot();
        this.eventHub.setSnapshot(this.currentSnapshot());
    }

    private async log(chunk: string) {
        if (!chunk) return;
        this.rawLog += chunk;
        await this.ensureWorkspace();
        await appendFile(terminalLogPath, chunk);
        this.eventHub.appendLog(chunk);
    }

    private prompt() {
        const relative = path.relative(repoRoot, this.snapshot.cwd);
        return relative ? `silk/${relative}` : 'silk';
    }

    private async changeDirectory(argument?: string) {
        const requested = argument ? path.resolve(this.snapshot.cwd, argument) : repoRoot;
        if (!isInsideRepository(requested)) {
            throw new Error(`The manual terminal is confined to ${repoRoot}`);
        }
        const resolved = await realpath(requested).catch(() => {
            throw new Error(`Directory does not exist: ${requested}`);
        });
        if (!(await stat(resolved)).isDirectory()) throw new Error(`Not a directory: ${resolved}`);
        if (!isInsideRepository(resolved)) throw new Error(`Directory escaped ${repoRoot}`);
        await this.patchSnapshot({ cwd: resolved, exitCode: 0, signal: null });
    }

    async execute(input: string, internal = false) {
        await this.initialize();
        if (this.snapshot.preparing && !internal) {
            throw new Error('Wait for the empty app to finish preparing.');
        }
        if (this.activeProcess || this.snapshot.running)
            throw new Error('A command is already running.');
        const command = input.trim();
        if (command.length > MAX_COMMAND_LENGTH) throw new Error('Command is too long.');
        const [bin, ...args] = parseCommandLine(command);
        await this.log(`\n${this.prompt()} $ ${command}\n`);

        if (bin === 'cd') {
            if (args.length > 1) throw new Error('cd accepts one directory.');
            await this.changeDirectory(args[0]);
            return this.currentSnapshot();
        }
        if (bin === 'pwd') {
            if (args.length) throw new Error('pwd does not accept arguments.');
            await this.log(`${this.snapshot.cwd}\n`);
            await this.patchSnapshot({ exitCode: 0, signal: null });
            return this.currentSnapshot();
        }
        if (bin === 'clear') {
            if (args.length) throw new Error('clear does not accept arguments.');
            this.rawLog = '';
            await writeFile(terminalLogPath, '');
            this.eventHub.clear();
            await this.patchSnapshot({ exitCode: 0, signal: null });
            return this.currentSnapshot();
        }

        await this.patchSnapshot({
            running: true,
            activeCommand: command,
            startedAt: new Date().toISOString(),
            finishedAt: null,
            exitCode: null,
            signal: null
        });
        const child = spawnDetached({ bin, args, cwd: this.snapshot.cwd, env: { TERM: 'dumb' } });
        this.activeProcess = child;
        let resolveCompletion = () => {};
        const completion = new Promise<void>((resolve) => {
            resolveCompletion = resolve;
        });
        this.activeCompletion = completion;
        let settled = false;
        const finish = async (exitCode: number | null, signal: NodeJS.Signals | null) => {
            if (settled) return;
            settled = true;
            try {
                if (this.activeProcess === child) this.activeProcess = null;
                await this.patchSnapshot({
                    running: false,
                    activeCommand: null,
                    finishedAt: new Date().toISOString(),
                    exitCode,
                    signal
                });
                await this.log(
                    exitCode === 0
                        ? `\nDone.\n`
                        : `\nExited with ${exitCode ?? signal ?? 'an unknown status'}.\n`
                );
            } finally {
                if (this.activeCompletion === completion) this.activeCompletion = null;
                resolveCompletion();
            }
        };
        const capture = (data: Buffer | string) => {
            void this.log(stripVTControlCharacters(data.toString()));
        };
        child.stdout?.on('data', capture);
        child.stderr?.on('data', capture);
        child.once('error', (error) => {
            void this.log(`${String(error)}\n`).then(() => finish(null, null));
        });
        child.once('close', (code, signal) => void finish(code, signal));
        return this.currentSnapshot();
    }

    private async prepareCommand(spec: CommandSpec) {
        if (this.preparationCancelled) throw new Error('Preparation cancelled.');
        await this.patchSnapshot({ cwd: spec.cwd });
        await this.execute(commandLabel(spec), true);
        await this.activeCompletion;
        if (this.preparationCancelled) throw new Error('Preparation cancelled.');
        if (this.snapshot.exitCode !== 0) {
            throw new Error(
                `${commandLabel(spec)} exited with ${this.snapshot.exitCode ?? this.snapshot.signal}.`
            );
        }
    }

    private async prepareWorkflow(source: RunSource, installPath: InstallPath) {
        try {
            for (const spec of scaffoldCommands(manualConsumerRoot)) {
                await this.prepareCommand(spec);
            }

            if (source === 'local') {
                const packageRoot = path.join(repoRoot, 'packages', 'sivir');
                await this.prepareCommand({ bin: 'bun', args: ['run', 'build'], cwd: packageRoot });
                await this.prepareCommand({
                    bin: 'bun',
                    args: ['pm', 'pack', '--filename', manualTarballPath, '--quiet'],
                    cwd: packageRoot
                });
            }

            if (source === 'local' || installPath === 'cli') {
                await this.prepareCommand(
                    consumerInstallCommand(source, manualConsumerRoot, manualTarballPath, 'latest')
                );
            }

            this.rawLog = '';
            await writeFile(terminalLogPath, '');
            this.eventHub.clear();
            await this.patchSnapshot({
                cwd: manualConsumerRoot,
                running: false,
                preparing: false,
                activeCommand: null,
                finishedAt: new Date().toISOString(),
                exitCode: 0,
                signal: null,
                prepared: true
            });
            await this.log(`Empty Svelte app ready in ${manualConsumerRoot}\n`);
        } catch (cause) {
            await this.patchSnapshot({
                running: false,
                preparing: false,
                activeCommand: null,
                finishedAt: new Date().toISOString(),
                prepared: false
            });
            await this.log(`${cause instanceof Error ? cause.message : String(cause)}\n`);
        }
    }

    async prepare(source: RunSource, installPath: InstallPath, force = false) {
        await this.initialize();
        if (
            !force &&
            this.snapshot.prepared &&
            this.snapshot.source === source &&
            this.snapshot.installPath === installPath
        ) {
            return this.currentSnapshot();
        }
        await this.cancel();
        await removeDisposableWorkspace(manualRoot);
        this.snapshot = {
            ...initialSnapshot(),
            preparing: true,
            activeCommand: 'Preparing empty Svelte app',
            startedAt: new Date().toISOString(),
            source,
            installPath
        };
        this.rawLog = '';
        this.preparationCancelled = false;
        await this.ensureWorkspace();
        await writeFile(terminalLogPath, '');
        await this.persistSnapshot();
        this.eventHub.clear();
        this.eventHub.setSnapshot(this.currentSnapshot());
        await this.log('Preparing an empty Svelte app…\n');

        const preparation = this.prepareWorkflow(source, installPath);
        this.activePreparation = preparation;
        void preparation.finally(() => {
            if (this.activePreparation === preparation) this.activePreparation = null;
        });
        return this.currentSnapshot();
    }

    async cancel() {
        await this.initialize();
        this.preparationCancelled = true;
        const completion = this.activeCompletion;
        const preparation = this.activePreparation;
        if (this.activeProcess) {
            await this.log('^C\n');
            await terminateProcess(this.activeProcess);
        }
        await completion;
        await preparation;
        return this.currentSnapshot();
    }

    async reset() {
        await this.initialize();
        await this.cancel();
        await removeDisposableWorkspace(manualRoot);
        this.snapshot = initialSnapshot();
        this.rawLog = '';
        await this.ensureWorkspace();
        await writeFile(terminalLogPath, '');
        await this.persistSnapshot();
        this.eventHub.clear();
        this.eventHub.setSnapshot(this.currentSnapshot());
        await this.log(`Manual workspace ready at ${manualRoot}\n`);
        return this.currentSnapshot();
    }
}

export const terminalManager = new TerminalManager();
