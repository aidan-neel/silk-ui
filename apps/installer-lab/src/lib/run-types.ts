export const SOURCES = ['local', 'npm'] as const;
export const INSTALL_PATHS = ['cli', 'package'] as const;

export type RunSource = (typeof SOURCES)[number];
export type InstallPath = (typeof INSTALL_PATHS)[number];

export const RUN_PHASES = [
    'idle',
    'cleaning',
    'scaffolding',
    'resolving-artifact',
    'installing',
    'generating',
    'checking',
    'building',
    'starting',
    'ready',
    'failed',
    'cancelled'
] as const;

export type RunPhase = (typeof RUN_PHASES)[number];

export type CommandSummary = {
    bin: string;
    args: string[];
    cwd: string;
};

export type RunFailure = {
    message: string;
    phase: RunPhase;
    command?: CommandSummary;
    exitCode?: number | null;
    signal?: NodeJS.Signals | null;
    output?: string;
};

export type RunSnapshot = {
    id: string | null;
    phase: RunPhase;
    source: RunSource;
    installPath: InstallPath;
    startedAt: string | null;
    finishedAt: string | null;
    elapsedMs: number;
    componentCount: number;
    version: string | null;
    previewUrl: string | null;
    previewPid: number | null;
    activeCommand: CommandSummary | null;
    failure: RunFailure | null;
};

export type RunEvent = { type: 'snapshot'; snapshot: RunSnapshot } | { type: 'log'; chunk: string };

export function isRunSource(value: unknown): value is RunSource {
    return typeof value === 'string' && SOURCES.includes(value as RunSource);
}

export function isInstallPath(value: unknown): value is InstallPath {
    return typeof value === 'string' && INSTALL_PATHS.includes(value as InstallPath);
}

export function isActivePhase(phase: RunPhase) {
    return !['idle', 'ready', 'failed', 'cancelled'].includes(phase);
}
