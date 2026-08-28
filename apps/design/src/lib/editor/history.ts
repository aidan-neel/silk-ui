import { stableStringify } from '../document/portable';
import { parseDesignDocument } from '../document/schema';
import type { DesignDocument } from '../document/types';
import { applyDesignCommand, type DesignCommand } from './commands';

export const DEFAULT_HISTORY_LIMITS = {
    maxEntries: 100,
    maxBytes: 20 * 1024 * 1024
} as const;

export type HistoryLimits = {
    readonly maxEntries: number;
    readonly maxBytes: number;
};

export type HistoryEntry = {
    readonly command: DesignCommand;
    readonly inverse: DesignCommand;
    readonly selectionBefore: string | null;
    readonly selectionAfter: string | null;
    readonly transactionId: string | null;
    readonly byteSize: number;
};

export type DesignHistory = {
    readonly document: DesignDocument;
    readonly selection: string | null;
    readonly past: readonly HistoryEntry[];
    readonly future: readonly HistoryEntry[];
    readonly limits: HistoryLimits;
    readonly byteSize: number;
};

export type ExecuteHistoryOptions = {
    readonly selection?: string | null;
    readonly transactionId?: string | null;
};

function validateLimits(limits: HistoryLimits): void {
    if (!Number.isInteger(limits.maxEntries) || limits.maxEntries < 0) {
        throw new RangeError('History maxEntries must be a non-negative integer.');
    }

    if (!Number.isInteger(limits.maxBytes) || limits.maxBytes < 0) {
        throw new RangeError('History maxBytes must be a non-negative integer.');
    }
}

function normalizeSelection(document: DesignDocument, selection: string | null): string | null {
    return selection !== null && Object.hasOwn(document.nodes, selection) ? selection : null;
}

function entrySize(command: DesignCommand, inverse: DesignCommand): number {
    return new TextEncoder().encode(stableStringify({ command, inverse }, 0)).byteLength;
}

function flattenBatch(command: DesignCommand): readonly DesignCommand[] {
    return command.type === 'batch' ? command.commands : [command];
}

function createEntry(
    command: DesignCommand,
    inverse: DesignCommand,
    selectionBefore: string | null,
    selectionAfter: string | null,
    transactionId: string | null
): HistoryEntry {
    return {
        command,
        inverse,
        selectionBefore,
        selectionAfter,
        transactionId,
        byteSize: entrySize(command, inverse)
    };
}

function prunePast(
    entries: readonly HistoryEntry[],
    limits: HistoryLimits
): { readonly entries: readonly HistoryEntry[]; readonly byteSize: number } {
    const retained = [...entries];
    let byteSize = retained.reduce((total, entry) => total + entry.byteSize, 0);

    while (
        retained.length > 0 &&
        (retained.length > limits.maxEntries || byteSize > limits.maxBytes)
    ) {
        const removed = retained.shift();
        byteSize -= removed?.byteSize ?? 0;
    }

    return { entries: retained, byteSize };
}

export function createDesignHistory(
    document: DesignDocument,
    selection: string | null = null,
    limits: HistoryLimits = DEFAULT_HISTORY_LIMITS
): DesignHistory {
    validateLimits(limits);
    const validated = parseDesignDocument(document);

    return {
        document: validated,
        selection: normalizeSelection(validated, selection),
        past: [],
        future: [],
        limits,
        byteSize: 0
    };
}

export function executeDesignCommand(
    history: DesignHistory,
    command: DesignCommand,
    options: ExecuteHistoryOptions = {}
): DesignHistory {
    const result = applyDesignCommand(history.document, command);
    const selectionAfter = normalizeSelection(
        result.document,
        options.selection === undefined ? history.selection : options.selection
    );
    const transactionId = options.transactionId ?? null;
    const previousEntry = history.past.at(-1);
    const entries = [...history.past];

    if (transactionId !== null && previousEntry?.transactionId === transactionId) {
        entries.pop();
        const combinedCommand: DesignCommand = {
            type: 'batch',
            commands: [...flattenBatch(previousEntry.command), ...flattenBatch(command)]
        };
        const combinedInverse: DesignCommand = {
            type: 'batch',
            commands: [...flattenBatch(result.inverse), ...flattenBatch(previousEntry.inverse)]
        };
        entries.push(
            createEntry(
                combinedCommand,
                combinedInverse,
                previousEntry.selectionBefore,
                selectionAfter,
                transactionId
            )
        );
    } else {
        entries.push(
            createEntry(command, result.inverse, history.selection, selectionAfter, transactionId)
        );
    }

    const pruned = prunePast(entries, history.limits);

    return {
        ...history,
        document: result.document,
        selection: selectionAfter,
        past: pruned.entries,
        future: [],
        byteSize: pruned.byteSize
    };
}

export function undoDesignCommand(history: DesignHistory): DesignHistory {
    const entry = history.past.at(-1);

    if (!entry) {
        return history;
    }

    const result = applyDesignCommand(history.document, entry.inverse);
    const past = history.past.slice(0, -1);

    return {
        ...history,
        document: result.document,
        selection: normalizeSelection(result.document, entry.selectionBefore),
        past,
        future: [...history.future, entry],
        byteSize: history.byteSize - entry.byteSize
    };
}

export function redoDesignCommand(history: DesignHistory): DesignHistory {
    const entry = history.future.at(-1);

    if (!entry) {
        return history;
    }

    const result = applyDesignCommand(history.document, entry.command);
    const pruned = prunePast([...history.past, entry], history.limits);

    return {
        ...history,
        document: result.document,
        selection: normalizeSelection(result.document, entry.selectionAfter),
        past: pruned.entries,
        future: history.future.slice(0, -1),
        byteSize: pruned.byteSize
    };
}
