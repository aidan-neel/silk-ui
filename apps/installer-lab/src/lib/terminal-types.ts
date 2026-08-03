import type { InstallPath, RunSource } from './run-types';

export type TerminalSnapshot = {
    cwd: string;
    running: boolean;
    preparing: boolean;
    activeCommand: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    exitCode: number | null;
    signal: NodeJS.Signals | null;
    prepared: boolean;
    source: RunSource | null;
    installPath: InstallPath | null;
};

export type TerminalEvent =
    | { type: 'snapshot'; snapshot: TerminalSnapshot }
    | { type: 'log'; chunk: string }
    | { type: 'clear' };

export type ManualStep = {
    id: string;
    title: string;
    description: string;
    command: string;
};

export type ManualPlan = {
    workspace: string;
    steps: ManualStep[];
};
