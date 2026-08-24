import { type ChildProcess, spawn } from 'node:child_process';
import type { CommandSummary, InstallPath, RunSource } from '$lib/run-types';

export type CommandSpec = CommandSummary & {
    env?: NodeJS.ProcessEnv;
};

export const commandLabel = (command: CommandSummary) =>
    [command.bin, ...command.args].map(quoteArgument).join(' ');

function quoteArgument(argument: string) {
    return /^[a-zA-Z0-9_./:@=-]+$/.test(argument) ? argument : JSON.stringify(argument);
}

export function scaffoldCommands(consumerRoot: string): CommandSpec[] {
    return [
        {
            bin: 'bunx',
            args: [
                '--bun',
                'sv',
                'create',
                consumerRoot,
                '--template',
                'minimal',
                '--types',
                'ts',
                '--no-add-ons',
                '--no-install'
            ],
            cwd: consumerRoot.replace(/[/\\]consumer$/, '')
        },
        {
            bin: 'bunx',
            args: [
                '--bun',
                'sv',
                'add',
                'tailwindcss=plugins:none',
                '--cwd',
                consumerRoot,
                '--no-install',
                '--no-git-check'
            ],
            cwd: consumerRoot
        },
        { bin: 'bun', args: ['add', '@fontsource/inter@5.3.0'], cwd: consumerRoot }
    ];
}

export function stagingInstallCommand(source: RunSource, stagingRoot: string, tarballPath: string) {
    return {
        bin: 'bun',
        args: ['add', source === 'local' ? tarballPath : '@sivir-ui/svelte@latest'],
        cwd: stagingRoot
    } satisfies CommandSpec;
}

export function consumerInstallCommand(
    source: RunSource,
    consumerRoot: string,
    tarballPath: string,
    version: string
) {
    return {
        bin: 'bun',
        args: ['add', source === 'local' ? tarballPath : `@sivir-ui/svelte@${version}`],
        cwd: consumerRoot
    } satisfies CommandSpec;
}

export function cliCommands(binary: string, consumerRoot: string) {
    return [
        { bin: binary, args: ['--cwd', consumerRoot, 'init', '-y'], cwd: consumerRoot },
        {
            bin: binary,
            args: ['--cwd', consumerRoot, 'add', '*', '-y'],
            cwd: consumerRoot
        }
    ] satisfies CommandSpec[];
}

export function verificationCommands(consumerRoot: string) {
    return {
        check: {
            bin: 'bunx',
            args: ['svelte-check', '--tsconfig', './tsconfig.json'],
            cwd: consumerRoot
        },
        build: { bin: 'bun', args: ['run', 'build'], cwd: consumerRoot }
    } satisfies Record<'check' | 'build', CommandSpec>;
}

export function previewCommand(consumerRoot: string, port: number) {
    return {
        bin: 'bun',
        args: [
            'run',
            'preview',
            '--',
            '--host',
            '127.0.0.1',
            '--port',
            String(port),
            '--strictPort'
        ],
        cwd: consumerRoot
    } satisfies CommandSpec;
}

export function spawnDetached(command: CommandSpec): ChildProcess {
    return spawn(command.bin, command.args, {
        cwd: command.cwd,
        env: { ...process.env, CI: '1', NO_COLOR: '1', ...command.env },
        detached: process.platform !== 'win32',
        stdio: ['ignore', 'pipe', 'pipe']
    });
}

export function combinationKey(source: RunSource, installPath: InstallPath) {
    return `${source}:${installPath}` as const;
}
