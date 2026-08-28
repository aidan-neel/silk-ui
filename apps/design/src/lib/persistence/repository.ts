import { parseDesignDocument } from '../document/schema';
import type { DesignDocument } from '../document/types';

export const DESIGN_DATABASE_NAME = 'sivir-design' as const;
export const DESIGN_DATABASE_VERSION = 1 as const;

const PROJECT_STORE = 'projects';
const RECOVERY_STORE = 'recoveries';
const RECOVERY_PROJECT_INDEX = 'projectId';

export type RepositoryMode = 'indexeddb' | 'memory';
export type RecoveryReason = 'previous-valid' | 'revision-conflict' | 'invalid-record';

export type SavedProject = {
    readonly projectId: string;
    readonly revision: number;
    readonly document: DesignDocument;
    readonly updatedAt: string;
};

export type RecoveryRecord = {
    readonly id: string;
    readonly projectId: string;
    readonly reason: RecoveryReason;
    readonly sourceRevision: number | null;
    readonly expectedRevision: number | null;
    readonly actualRevision: number | null;
    readonly snapshot: unknown;
    readonly createdAt: string;
};

export interface DesignRepository {
    readonly mode: RepositoryMode;
    readonly fallbackReason: string | null;
    load(projectId: string): Promise<SavedProject | null>;
    save(
        projectId: string,
        document: DesignDocument,
        expectedRevision: number
    ): Promise<SavedProject>;
    listRecoveries(projectId: string): Promise<readonly RecoveryRecord[]>;
    close(): void;
}

export type RepositoryOptions = {
    readonly indexedDB?: IDBFactory | null;
    readonly databaseName?: string;
    readonly now?: () => number;
    readonly createId?: () => string;
};

type RepositoryDependencies = {
    readonly now: () => number;
    readonly createId: () => string;
};

export class RevisionConflictError extends Error {
    readonly projectId: string;
    readonly expectedRevision: number;
    readonly actualRevision: number;
    readonly recoveryId: string;

    constructor(
        projectId: string,
        expectedRevision: number,
        actualRevision: number,
        recoveryId: string
    ) {
        super(
            `Project ${projectId} is at revision ${actualRevision}, not expected revision ${expectedRevision}.`
        );
        this.name = 'RevisionConflictError';
        this.projectId = projectId;
        this.expectedRevision = expectedRevision;
        this.actualRevision = actualRevision;
        this.recoveryId = recoveryId;
    }
}

export class CorruptProjectError extends Error {
    readonly projectId: string;
    readonly recoveryId: string;

    constructor(projectId: string, recoveryId: string) {
        super(`Project ${projectId} contains malformed persisted data.`);
        this.name = 'CorruptProjectError';
        this.projectId = projectId;
        this.recoveryId = recoveryId;
    }
}

let fallbackId = 0;

function defaultCreateId(): string {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
        return globalThis.crypto.randomUUID();
    }

    fallbackId += 1;
    return `local-${Date.now().toString(36)}-${fallbackId.toString(36)}`;
}

function dependencies(options: RepositoryOptions): RepositoryDependencies {
    return {
        now: options.now ?? Date.now,
        createId: options.createId ?? defaultCreateId
    };
}

function validateProjectId(projectId: string): void {
    if (
        projectId.length === 0 ||
        projectId.length > 128 ||
        !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(projectId)
    ) {
        throw new TypeError('Project IDs must be non-empty safe identifiers up to 128 characters.');
    }
}

function validateExpectedRevision(revision: number): void {
    if (!Number.isInteger(revision) || revision < 0) {
        throw new TypeError('Expected revision must be a non-negative integer.');
    }
}

function timestamp(deps: RepositoryDependencies): string {
    return new Date(deps.now()).toISOString();
}

function previousRecovery(project: SavedProject, deps: RepositoryDependencies): RecoveryRecord {
    return {
        id: `previous:${project.projectId}`,
        projectId: project.projectId,
        reason: 'previous-valid',
        sourceRevision: project.revision,
        expectedRevision: null,
        actualRevision: project.revision,
        snapshot: structuredClone(project.document),
        createdAt: timestamp(deps)
    };
}

function conflictRecovery(
    projectId: string,
    document: DesignDocument,
    expectedRevision: number,
    actualRevision: number,
    deps: RepositoryDependencies
): RecoveryRecord {
    return {
        id: `conflict:${projectId}:${deps.createId()}`,
        projectId,
        reason: 'revision-conflict',
        sourceRevision: expectedRevision,
        expectedRevision,
        actualRevision,
        snapshot: structuredClone(document),
        createdAt: timestamp(deps)
    };
}

function invalidRecovery(
    projectId: string,
    snapshot: unknown,
    sourceRevision: number | null,
    deps: RepositoryDependencies
): RecoveryRecord {
    return {
        id: `invalid:${projectId}:${deps.createId()}`,
        projectId,
        reason: 'invalid-record',
        sourceRevision,
        expectedRevision: null,
        actualRevision: sourceRevision,
        snapshot: structuredClone(snapshot),
        createdAt: timestamp(deps)
    };
}

function sortRecoveries(records: readonly RecoveryRecord[]): readonly RecoveryRecord[] {
    return [...records].sort((left, right) => {
        if (left.createdAt < right.createdAt) {
            return -1;
        }

        if (left.createdAt > right.createdAt) {
            return 1;
        }

        if (left.id < right.id) {
            return -1;
        }

        if (left.id > right.id) {
            return 1;
        }

        return 0;
    });
}

function cloneProject(project: SavedProject): SavedProject {
    return {
        ...project,
        document: parseDesignDocument(project.document)
    };
}

export class MemoryDesignRepository implements DesignRepository {
    readonly mode = 'memory' as const;
    readonly fallbackReason: string | null;

    readonly #projects = new Map<string, SavedProject>();
    readonly #recoveries = new Map<string, RecoveryRecord>();
    readonly #dependencies: RepositoryDependencies;

    constructor(
        fallbackReason: string | null = null,
        options: Pick<RepositoryOptions, 'now' | 'createId'> = {}
    ) {
        this.fallbackReason = fallbackReason;
        this.#dependencies = dependencies(options);
    }

    async load(projectId: string): Promise<SavedProject | null> {
        validateProjectId(projectId);
        const project = this.#projects.get(projectId);
        return project ? cloneProject(project) : null;
    }

    async save(
        projectId: string,
        inputDocument: DesignDocument,
        expectedRevision: number
    ): Promise<SavedProject> {
        validateProjectId(projectId);
        validateExpectedRevision(expectedRevision);
        const document = parseDesignDocument(inputDocument);
        const current = this.#projects.get(projectId);
        const actualRevision = current?.revision ?? 0;

        if (expectedRevision !== actualRevision) {
            const recovery = conflictRecovery(
                projectId,
                document,
                expectedRevision,
                actualRevision,
                this.#dependencies
            );
            this.#recoveries.set(recovery.id, recovery);
            throw new RevisionConflictError(
                projectId,
                expectedRevision,
                actualRevision,
                recovery.id
            );
        }

        if (current) {
            const recovery = previousRecovery(current, this.#dependencies);
            this.#recoveries.set(recovery.id, recovery);
        }

        const project: SavedProject = {
            projectId,
            revision: actualRevision + 1,
            document,
            updatedAt: timestamp(this.#dependencies)
        };
        this.#projects.set(projectId, cloneProject(project));
        return cloneProject(project);
    }

    async listRecoveries(projectId: string): Promise<readonly RecoveryRecord[]> {
        validateProjectId(projectId);
        const records = [...this.#recoveries.values()]
            .filter((record) => record.projectId === projectId)
            .map((record) => structuredClone(record));
        return sortRecoveries(records);
    }

    close(): void {
        return;
    }
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error ?? new Error('IndexedDB request failed.'));
        };
    });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => {
            reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
        };
        transaction.onabort = () => {
            reject(transaction.error ?? new Error('IndexedDB transaction was aborted.'));
        };
    });
}

async function finishTransaction<T>(
    transaction: IDBTransaction,
    operation: Promise<T>
): Promise<T> {
    const done = transactionDone(transaction);

    try {
        const result = await operation;
        await done;
        return result;
    } catch (error) {
        try {
            await done;
        } catch {
            // The request error is the more specific failure when both reject.
        }
        throw error;
    }
}

function openDatabase(factory: IDBFactory, name: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        let request: IDBOpenDBRequest;
        let settled = false;

        try {
            request = factory.open(name, DESIGN_DATABASE_VERSION);
        } catch (error) {
            reject(error);
            return;
        }

        request.onupgradeneeded = () => {
            const database = request.result;

            if (!database.objectStoreNames.contains(PROJECT_STORE)) {
                database.createObjectStore(PROJECT_STORE, { keyPath: 'projectId' });
            }

            if (!database.objectStoreNames.contains(RECOVERY_STORE)) {
                const recoveries = database.createObjectStore(RECOVERY_STORE, { keyPath: 'id' });
                recoveries.createIndex(RECOVERY_PROJECT_INDEX, 'projectId', { unique: false });
            }
        };
        request.onsuccess = () => {
            const database = request.result;

            if (settled) {
                database.close();
                return;
            }

            settled = true;
            database.onversionchange = () => {
                database.close();
            };
            resolve(database);
        };
        request.onerror = () => {
            settled = true;
            reject(request.error ?? new Error('Unable to open IndexedDB.'));
        };
        request.onblocked = () => {
            settled = true;
            reject(new Error('IndexedDB upgrade is blocked by another tab.'));
        };
    });
}

function isStoredProject(value: unknown): value is SavedProject {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const record = value as Record<string, unknown>;
    return (
        typeof record.projectId === 'string' &&
        Number.isInteger(record.revision) &&
        (record.revision as number) > 0 &&
        typeof record.updatedAt === 'string' &&
        Object.hasOwn(record, 'document')
    );
}

function isNullableRevision(value: unknown): value is number | null {
    return value === null || (Number.isInteger(value) && (value as number) >= 0);
}

function isRecoveryRecord(value: unknown): value is RecoveryRecord {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const record = value as Record<string, unknown>;
    return (
        typeof record.id === 'string' &&
        typeof record.projectId === 'string' &&
        (record.reason === 'previous-valid' ||
            record.reason === 'revision-conflict' ||
            record.reason === 'invalid-record') &&
        isNullableRevision(record.sourceRevision) &&
        isNullableRevision(record.expectedRevision) &&
        isNullableRevision(record.actualRevision) &&
        typeof record.createdAt === 'string' &&
        Object.hasOwn(record, 'snapshot')
    );
}

class IndexedDbDesignRepository implements DesignRepository {
    readonly mode = 'indexeddb' as const;
    readonly fallbackReason = null;

    readonly #database: IDBDatabase;
    readonly #dependencies: RepositoryDependencies;

    constructor(database: IDBDatabase, deps: RepositoryDependencies) {
        this.#database = database;
        this.#dependencies = deps;
    }

    async #storeInvalid(
        projectId: string,
        snapshot: unknown,
        sourceRevision: number | null
    ): Promise<string> {
        const recovery = invalidRecovery(projectId, snapshot, sourceRevision, this.#dependencies);
        const transaction = this.#database.transaction(RECOVERY_STORE, 'readwrite');
        const operation = requestResult(transaction.objectStore(RECOVERY_STORE).put(recovery));
        await finishTransaction(transaction, operation);
        return recovery.id;
    }

    async load(projectId: string): Promise<SavedProject | null> {
        validateProjectId(projectId);
        const transaction = this.#database.transaction(PROJECT_STORE, 'readonly');
        const request = transaction.objectStore(PROJECT_STORE).get(projectId);
        const raw = await finishTransaction(transaction, requestResult(request));

        if (raw === undefined) {
            return null;
        }

        if (!isStoredProject(raw)) {
            const recoveryId = await this.#storeInvalid(projectId, raw, null);
            throw new CorruptProjectError(projectId, recoveryId);
        }

        try {
            return cloneProject(raw);
        } catch {
            const recoveryId = await this.#storeInvalid(projectId, raw, raw.revision);
            throw new CorruptProjectError(projectId, recoveryId);
        }
    }

    async save(
        projectId: string,
        inputDocument: DesignDocument,
        expectedRevision: number
    ): Promise<SavedProject> {
        validateProjectId(projectId);
        validateExpectedRevision(expectedRevision);
        const document = parseDesignDocument(inputDocument);
        const transaction = this.#database.transaction(
            [PROJECT_STORE, RECOVERY_STORE],
            'readwrite'
        );
        const done = transactionDone(transaction);
        const projects = transaction.objectStore(PROJECT_STORE);
        const recoveries = transaction.objectStore(RECOVERY_STORE);
        let raw: unknown;

        try {
            raw = await requestResult(projects.get(projectId));
        } catch (error) {
            try {
                await done;
            } catch {
                // Preserve the request error below.
            }
            throw error;
        }

        let current: SavedProject | null = null;

        if (raw !== undefined) {
            if (!isStoredProject(raw)) {
                const recovery = invalidRecovery(projectId, raw, null, this.#dependencies);
                recoveries.put(recovery);
                await done;
                throw new CorruptProjectError(projectId, recovery.id);
            }

            try {
                current = cloneProject(raw);
            } catch {
                const recovery = invalidRecovery(projectId, raw, raw.revision, this.#dependencies);
                recoveries.put(recovery);
                await done;
                throw new CorruptProjectError(projectId, recovery.id);
            }
        }

        const actualRevision = current?.revision ?? 0;

        if (expectedRevision !== actualRevision) {
            const recovery = conflictRecovery(
                projectId,
                document,
                expectedRevision,
                actualRevision,
                this.#dependencies
            );
            recoveries.put(recovery);
            await done;
            throw new RevisionConflictError(
                projectId,
                expectedRevision,
                actualRevision,
                recovery.id
            );
        }

        if (current) {
            recoveries.put(previousRecovery(current, this.#dependencies));
        }

        const project: SavedProject = {
            projectId,
            revision: actualRevision + 1,
            document,
            updatedAt: timestamp(this.#dependencies)
        };
        projects.put(project);
        await done;
        return cloneProject(project);
    }

    async listRecoveries(projectId: string): Promise<readonly RecoveryRecord[]> {
        validateProjectId(projectId);
        const transaction = this.#database.transaction(RECOVERY_STORE, 'readonly');
        const index = transaction.objectStore(RECOVERY_STORE).index(RECOVERY_PROJECT_INDEX);
        const raw = await finishTransaction(transaction, requestResult(index.getAll(projectId)));
        const records = raw.filter(isRecoveryRecord).map((record) => structuredClone(record));
        return sortRecoveries(records);
    }

    close(): void {
        this.#database.close();
    }
}

export function createMemoryDesignRepository(
    options: Pick<RepositoryOptions, 'now' | 'createId'> = {}
): DesignRepository {
    return new MemoryDesignRepository(null, options);
}

export async function createDesignRepository(
    options: RepositoryOptions = {}
): Promise<DesignRepository> {
    const factory =
        options.indexedDB === undefined
            ? typeof globalThis.indexedDB === 'undefined'
                ? null
                : globalThis.indexedDB
            : options.indexedDB;

    if (!factory) {
        return new MemoryDesignRepository('IndexedDB is unavailable in this environment.', options);
    }

    try {
        const database = await openDatabase(factory, options.databaseName ?? DESIGN_DATABASE_NAME);
        return new IndexedDbDesignRepository(database, dependencies(options));
    } catch (error) {
        const reason = error instanceof Error ? error.message : 'IndexedDB could not be opened.';
        return new MemoryDesignRepository(reason, options);
    }
}
