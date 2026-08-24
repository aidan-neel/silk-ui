import type { ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stripVTControlCharacters } from 'node:util';
import type {
    CommandSummary,
    InstallPath,
    RunEvent,
    RunFailure,
    RunPhase,
    RunSnapshot,
    RunSource
} from '$lib/run-types';
import { isActivePhase } from '$lib/run-types';
import {
    type CommandSpec,
    cliCommands,
    commandLabel,
    consumerInstallCommand,
    previewCommand,
    scaffoldCommands,
    spawnDetached,
    stagingInstallCommand,
    verificationCommands
} from './commands';
import { RunEventHub } from './event-hub';
import { generateShowcase, type RegistryIndex } from './generator';
import {
    artifactRoot,
    consumerRoot,
    currentRoot,
    docsComponentsRoot,
    ensureCurrentRoot,
    labTempRoot,
    logPath,
    removeDisposableWorkspace,
    repoRoot,
    snapshotPath,
    stagingRoot
} from './paths';
import { findAvailablePort, waitForHttpReady } from './port';
import { assertTransition } from './state-machine';

const TERMINAL_PHASES = new Set<RunPhase>(['ready', 'failed', 'cancelled', 'idle']);
const MAX_FAILURE_OUTPUT = 24_000;

class CancelledError extends Error {
    constructor() {
        super('Run cancelled');
        this.name = 'CancelledError';
    }
}

export class CommandError extends Error {
    constructor(
        message: string,
        readonly command: CommandSummary,
        readonly exitCode: number | null,
        readonly signal: NodeJS.Signals | null,
        readonly output: string
    ) {
        super(message);
        this.name = 'CommandError';
    }
}

const initialSnapshot = (): RunSnapshot => ({
    id: null,
    phase: 'idle',
    source: 'local',
    installPath: 'cli',
    startedAt: null,
    finishedAt: null,
    elapsedMs: 0,
    componentCount: 0,
    version: null,
    previewUrl: null,
    previewPid: null,
    activeCommand: null,
    failure: null
});

function killPid(pid: number, signal: NodeJS.Signals) {
    try {
        if (process.platform === 'win32') process.kill(pid, signal);
        else process.kill(-pid, signal);
        return true;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
        return false;
    }
}

export async function terminateProcess(child: ChildProcess | null, graceMs = 1_500) {
    if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;
    const exited = new Promise<void>((resolve) => child.once('close', () => resolve()));
    if (process.platform === 'win32') child.kill('SIGTERM');
    else killPid(child.pid, 'SIGTERM');
    await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, graceMs))]);
    if (child.exitCode === null && child.signalCode === null) {
        if (process.platform === 'win32') child.kill('SIGKILL');
        else killPid(child.pid, 'SIGKILL');
    }
}

export class RunManager {
    private snapshot = initialSnapshot();
    private rawLog = '';
    private initialized = false;
    private initializePromise: Promise<void> | null = null;
    private activeProcess: ChildProcess | null = null;
    private previewProcess: ChildProcess | null = null;
    private activeRun: Promise<void> | null = null;
    private abortController: AbortController | null = null;
    private eventHub = new RunEventHub(this.snapshot);

    constructor() {
        process.once('exit', () => {
            for (const child of [this.activeProcess, this.previewProcess]) {
                if (!child?.pid) continue;
                try {
                    if (process.platform === 'win32') child.kill('SIGTERM');
                    else process.kill(-child.pid, 'SIGTERM');
                } catch {
                    // The child already exited.
                }
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

    private async restore() {
        if (!existsSync(snapshotPath)) return;
        try {
            this.snapshot = {
                ...initialSnapshot(),
                ...JSON.parse(await readFile(snapshotPath, 'utf8'))
            };
            this.rawLog = existsSync(logPath) ? await readFile(logPath, 'utf8') : '';
            if (this.snapshot.previewPid) killPid(this.snapshot.previewPid, 'SIGTERM');
            if (isActivePhase(this.snapshot.phase)) {
                this.snapshot = {
                    ...this.snapshot,
                    phase: 'failed',
                    finishedAt: new Date().toISOString(),
                    previewPid: null,
                    previewUrl: null,
                    activeCommand: null,
                    failure: {
                        message: 'The installer-lab launcher restarted while this run was active.',
                        phase: this.snapshot.phase
                    }
                };
                await this.persistSnapshot();
            } else if (this.snapshot.previewPid) {
                this.snapshot.previewPid = null;
                this.snapshot.previewUrl = null;
                await this.persistSnapshot();
            }
        } catch (error) {
            this.snapshot = {
                ...initialSnapshot(),
                phase: 'failed',
                finishedAt: new Date().toISOString(),
                failure: {
                    message: `Could not restore the previous run: ${String(error)}`,
                    phase: 'failed'
                }
            };
        }
        this.eventHub.seed(this.currentSnapshot(), this.rawLog);
    }

    async getSnapshot() {
        await this.initialize();
        return this.currentSnapshot();
    }

    getLog() {
        return this.rawLog;
    }

    private currentSnapshot(): RunSnapshot {
        const elapsedMs = this.snapshot.startedAt
            ? (this.snapshot.finishedAt ? Date.parse(this.snapshot.finishedAt) : Date.now()) -
              Date.parse(this.snapshot.startedAt)
            : 0;
        return { ...this.snapshot, elapsedMs: Math.max(0, elapsedMs) };
    }

    subscribe(callback: (event: RunEvent) => void) {
        return this.eventHub.subscribe(callback);
    }

    private async persistSnapshot() {
        await ensureCurrentRoot();
        await writeFile(snapshotPath, `${JSON.stringify(this.currentSnapshot(), null, '\t')}\n`);
    }

    private async patchSnapshot(patch: Partial<RunSnapshot>) {
        this.snapshot = { ...this.snapshot, ...patch };
        await this.persistSnapshot();
        this.eventHub.setSnapshot(this.currentSnapshot());
    }

    private async setPhase(phase: RunPhase) {
        assertTransition(this.snapshot.phase, phase);
        await this.patchSnapshot({ phase });
    }

    private async log(chunk: string) {
        if (!chunk) return;
        this.rawLog += chunk;
        await ensureCurrentRoot();
        await appendFile(logPath, chunk);
        this.eventHub.appendLog(chunk);
    }

    async start(source: RunSource, installPath: InstallPath) {
        await this.initialize();
        if (this.activeRun) {
            await this.cancel();
            await this.activeRun;
        }
        await this.stopPreview();

        this.abortController = new AbortController();
        this.snapshot = {
            ...initialSnapshot(),
            id: crypto.randomUUID(),
            phase: 'cleaning',
            source,
            installPath,
            startedAt: new Date().toISOString()
        };
        this.rawLog = '';
        await removeDisposableWorkspace(currentRoot);
        await ensureCurrentRoot();
        await writeFile(logPath, '');
        await this.persistSnapshot();
        this.eventHub.seed(this.currentSnapshot(), '');
        this.eventHub.setSnapshot(this.currentSnapshot());

        this.activeRun = this.execute(source, installPath).finally(() => {
            this.activeRun = null;
            this.activeProcess = null;
            this.abortController = null;
        });
        return this.currentSnapshot();
    }

    async cancel() {
        await this.initialize();
        if (!this.activeRun || TERMINAL_PHASES.has(this.snapshot.phase))
            return this.currentSnapshot();
        this.abortController?.abort(new CancelledError());
        await terminateProcess(this.activeProcess);
        return this.currentSnapshot();
    }

    async shutdown() {
        this.abortController?.abort(new CancelledError());
        await terminateProcess(this.activeProcess);
        await this.stopPreview();
    }

    private async stopPreview() {
        await terminateProcess(this.previewProcess);
        this.previewProcess = null;
        if (this.snapshot.previewPid && !this.previewProcess) {
            try {
                killPid(this.snapshot.previewPid, 'SIGTERM');
            } catch {
                // It was already gone or does not belong to this launcher anymore.
            }
        }
    }

    private throwIfCancelled() {
        if (this.abortController?.signal.aborted) throw new CancelledError();
    }

    private async runCommand(command: CommandSpec) {
        this.throwIfCancelled();
        const summary: CommandSummary = { bin: command.bin, args: command.args, cwd: command.cwd };
        await this.patchSnapshot({ activeCommand: summary });
        await this.log(`\n$ ${commandLabel(command)}\n`);
        const child = spawnDetached(command);
        this.activeProcess = child;
        let output = '';
        const capture = (data: Buffer | string) => {
            const chunk = stripVTControlCharacters(data.toString());
            output = (output + chunk).slice(-MAX_FAILURE_OUTPUT);
            void this.log(chunk);
        };
        child.stdout?.on('data', capture);
        child.stderr?.on('data', capture);

        const result = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
            (resolve, reject) => {
                child.once('error', reject);
                child.once('close', (code, signal) => resolve({ code, signal }));
            }
        ).catch((error) => {
            throw new CommandError(String(error), summary, null, null, output);
        });
        if (this.activeProcess === child) this.activeProcess = null;
        await this.patchSnapshot({ activeCommand: null });
        this.throwIfCancelled();
        if (result.code !== 0) {
            throw new CommandError(
                `Command exited with ${result.code ?? result.signal ?? 'an unknown status'}`,
                summary,
                result.code,
                result.signal,
                output
            );
        }
        return output;
    }

    private async execute(source: RunSource, installPath: InstallPath) {
        try {
            await this.log(
                `Sivir installer lab · ${source} · ${installPath}\nWorkspace: ${currentRoot}\n`
            );
            await this.setPhase('scaffolding');
            await mkdir(path.dirname(consumerRoot), { recursive: true });
            for (const command of scaffoldCommands(consumerRoot)) await this.runCommand(command);

            await this.setPhase('resolving-artifact');
            await mkdir(stagingRoot, { recursive: true });
            await writeFile(
                path.join(stagingRoot, 'package.json'),
                `${JSON.stringify(
                    { name: 'installer-lab-artifact-stage', private: true },
                    null,
                    '\t'
                )}\n`
            );
            const tarballPath = path.join(stagingRoot, 'sivir-ui.tgz');
            if (source === 'local') {
                const packageRoot = path.join(repoRoot, 'packages', 'sivir');
                await this.runCommand({ bin: 'bun', args: ['run', 'build'], cwd: packageRoot });
                await this.runCommand({
                    bin: 'bun',
                    args: ['pm', 'pack', '--filename', tarballPath, '--quiet'],
                    cwd: packageRoot
                });
            }
            await this.runCommand(stagingInstallCommand(source, stagingRoot, tarballPath));

            const packageJsonPath = path.join(artifactRoot, 'package.json');
            const registryPath = path.join(artifactRoot, 'registry', 'index.json');
            const binaryPath = path.join(stagingRoot, 'node_modules', '.bin', 'sivir');
            for (const required of [
                packageJsonPath,
                registryPath,
                path.join(artifactRoot, 'src')
            ]) {
                if (!existsSync(required))
                    throw new Error(`Staged artifact is missing ${required}`);
            }
            const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
                version?: string;
                bin?: Record<string, string>;
                exports?: Record<string, unknown>;
            };
            const registry = JSON.parse(await readFile(registryPath, 'utf8')) as RegistryIndex;
            if (!packageJson.version) throw new Error('Staged artifact has no package version');
            if (!packageJson.bin?.sivir || !existsSync(binaryPath)) {
                throw new Error('Staged artifact does not expose an executable sivir binary');
            }
            if (!packageJson.exports?.['./components/*'] || !packageJson.exports?.['./ui.css']) {
                throw new Error('Staged artifact is missing component or CSS subpath exports');
            }
            const publicComponents = registry.components.filter(
                (component) => component.visibility === 'public'
            );
            await this.patchSnapshot({
                version: packageJson.version,
                componentCount: publicComponents.length
            });

            await this.setPhase('installing');
            if (installPath === 'cli') {
                for (const command of cliCommands(binaryPath, consumerRoot)) {
                    await this.runCommand(command);
                }
                const installedConfig = JSON.parse(
                    await readFile(path.join(consumerRoot, 'sivir.json'), 'utf8')
                ) as { components?: Record<string, string> };
                const missingComponents = publicComponents.filter(
                    (component) => !installedConfig.components?.[component.name]
                );
                if (missingComponents.length > 0) {
                    throw new Error(
                        `sivir.json did not record every public component: ${missingComponents.map((component) => component.name).join(', ')}`
                    );
                }
            } else {
                await this.runCommand(
                    consumerInstallCommand(source, consumerRoot, tarballPath, packageJson.version)
                );
            }

            await this.setPhase('generating');
            const generated = await generateShowcase({
                consumerRoot,
                docsComponentsRoot,
                registry,
                installPath
            });
            await this.log(`Generated ${generated.length} component routes.\n`);

            const verification = verificationCommands(consumerRoot);
            await this.setPhase('checking');
            await this.runCommand(verification.check);
            await this.setPhase('building');
            await this.runCommand(verification.build);

            await this.setPhase('starting');
            const port = await findAvailablePort();
            const url = `http://127.0.0.1:${port}`;
            const command = previewCommand(consumerRoot, port);
            await this.log(`\n$ ${commandLabel(command)}\n`);
            const preview = spawnDetached(command);
            this.previewProcess = preview;
            const previewExited = new Promise<never>((_, reject) => {
                preview.once('close', (code, signal) => {
                    reject(
                        new CommandError(
                            `Preview exited before verification completed (${code ?? signal ?? 'unknown status'}).`,
                            command,
                            code,
                            signal,
                            ''
                        )
                    );
                });
            });
            preview.stdout?.on(
                'data',
                (chunk) => void this.log(stripVTControlCharacters(chunk.toString()))
            );
            preview.stderr?.on(
                'data',
                (chunk) => void this.log(stripVTControlCharacters(chunk.toString()))
            );
            preview.once('close', (code, signal) => {
                if (this.previewProcess === preview) this.previewProcess = null;
                if (this.snapshot.phase === 'ready') {
                    void this.fail({
                        message: `Preview exited unexpectedly (${code ?? signal ?? 'unknown status'}).`,
                        phase: 'starting',
                        exitCode: code,
                        signal
                    });
                }
            });
            await this.patchSnapshot({ previewPid: preview.pid ?? null, previewUrl: url });
            await Promise.race([
                (async () => {
                    await waitForHttpReady(url, { signal: this.abortController?.signal });
                    for (const example of generated) {
                        this.throwIfCancelled();
                        const timeout = AbortSignal.timeout(10_000);
                        const signal = this.abortController
                            ? AbortSignal.any([this.abortController.signal, timeout])
                            : timeout;
                        const response = await fetch(new URL(example.route, url), { signal });
                        if (!response.ok) {
                            throw new Error(
                                `${example.route} returned HTTP ${response.status} after launch`
                            );
                        }
                    }
                })(),
                previewExited
            ]);
            await this.log(`Verified ${generated.length} preview routes over HTTP.\n`);
            this.throwIfCancelled();
            await this.patchSnapshot({
                phase: 'ready',
                finishedAt: new Date().toISOString(),
                activeCommand: null
            });
            await this.log(`\nReady: ${url}\n`);
        } catch (error) {
            if (error instanceof CancelledError || this.abortController?.signal.aborted) {
                await this.patchSnapshot({
                    phase: 'cancelled',
                    finishedAt: new Date().toISOString(),
                    activeCommand: null,
                    previewPid: null,
                    previewUrl: null,
                    failure: null
                });
                await this.log('\nRun cancelled. Generated files were retained for inspection.\n');
                return;
            }
            const failure: RunFailure =
                error instanceof CommandError
                    ? {
                          message: error.message,
                          phase: this.snapshot.phase,
                          command: error.command,
                          exitCode: error.exitCode,
                          signal: error.signal,
                          output: error.output
                      }
                    : {
                          message: error instanceof Error ? error.message : String(error),
                          phase: this.snapshot.phase
                      };
            await this.fail(failure);
        }
    }

    private async fail(failure: RunFailure) {
        await terminateProcess(this.previewProcess);
        this.previewProcess = null;
        await this.patchSnapshot({
            phase: 'failed',
            finishedAt: new Date().toISOString(),
            activeCommand: null,
            previewPid: null,
            previewUrl: null,
            failure
        });
        await this.log(`\nFAILED [${failure.phase}]: ${failure.message}\n`);
    }
}

export const runManager = new RunManager();

export const disposablePaths = { labTempRoot, currentRoot, consumerRoot, stagingRoot };
