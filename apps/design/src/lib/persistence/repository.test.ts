import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { SAMPLE_DOCUMENT } from '../document/sample';
import { applyDesignCommand } from '../editor/commands';
import {
    createDesignRepository,
    createMemoryDesignRepository,
    RevisionConflictError
} from './repository';

function deterministicOptions() {
    let id = 0;

    return {
        now: () => Date.UTC(2026, 7, 27, 12, 0, id),
        createId: () => {
            id += 1;
            return `recovery-${id}`;
        }
    };
}

describe('design repository', () => {
    it('checks revisions and keeps the previous valid document', async () => {
        const repository = createMemoryDesignRepository(deterministicOptions());
        const first = await repository.save('project-one', SAMPLE_DOCUMENT, 0);
        const edited = applyDesignCommand(first.document, {
            type: 'set-document-name',
            name: 'Edited project'
        }).document;
        const second = await repository.save('project-one', edited, 1);
        const recoveries = await repository.listRecoveries('project-one');

        expect(first.revision).toBe(1);
        expect(second.revision).toBe(2);
        expect(recoveries).toHaveLength(1);
        expect(recoveries[0]).toMatchObject({
            id: 'previous:project-one',
            reason: 'previous-valid',
            sourceRevision: 1
        });
        expect((recoveries[0].snapshot as { name: string }).name).toBe(SAMPLE_DOCUMENT.name);
    });

    it('preserves a stale write as recovery before reporting a conflict', async () => {
        const repository = createMemoryDesignRepository(deterministicOptions());
        await repository.save('project-one', SAMPLE_DOCUMENT, 0);
        const current = await repository.save('project-one', SAMPLE_DOCUMENT, 1);
        const staleDocument = applyDesignCommand(current.document, {
            type: 'set-document-name',
            name: 'Stale local work'
        }).document;

        await expect(repository.save('project-one', staleDocument, 1)).rejects.toMatchObject({
            name: RevisionConflictError.name,
            expectedRevision: 1,
            actualRevision: 2
        });

        const recoveries = await repository.listRecoveries('project-one');
        const conflict = recoveries.find((record) => record.reason === 'revision-conflict');

        if (!conflict) {
            throw new Error('Conflict recovery was not retained.');
        }

        expect((conflict.snapshot as { name: string }).name).toBe('Stale local work');
    });

    it('returns isolated document clones', async () => {
        const repository = createMemoryDesignRepository(deterministicOptions());
        await repository.save('project-one', SAMPLE_DOCUMENT, 0);
        const loaded = await repository.load('project-one');

        if (!loaded) {
            throw new Error('Saved project was not loaded.');
        }

        const mutable = loaded.document as unknown as { name: string };
        mutable.name = 'Mutated outside repository';
        const loadedAgain = await repository.load('project-one');
        expect(loadedAgain?.document.name).toBe(SAMPLE_DOCUMENT.name);
    });

    it('falls back explicitly when IndexedDB is unavailable', async () => {
        const repository = await createDesignRepository({
            indexedDB: null,
            ...deterministicOptions()
        });

        expect(repository.mode).toBe('memory');
        expect(repository.fallbackReason).toContain('unavailable');
        await expect(
            repository.save('fallback-project', SAMPLE_DOCUMENT, 0)
        ).resolves.toMatchObject({
            revision: 1
        });
    });

    it('persists revisions and recoveries through the IndexedDB driver', async () => {
        const indexedDB = new IDBFactory();
        const options = {
            indexedDB,
            databaseName: 'repository-test',
            ...deterministicOptions()
        };
        const firstRepository = await createDesignRepository(options);
        const first = await firstRepository.save('indexed-project', SAMPLE_DOCUMENT, 0);
        firstRepository.close();

        const secondRepository = await createDesignRepository(options);
        const loaded = await secondRepository.load('indexed-project');
        const edited = applyDesignCommand(first.document, {
            type: 'set-document-name',
            name: 'Indexed edit'
        }).document;
        const second = await secondRepository.save('indexed-project', edited, 1);
        const recoveries = await secondRepository.listRecoveries('indexed-project');

        expect(firstRepository.mode).toBe('indexeddb');
        expect(secondRepository.mode).toBe('indexeddb');
        expect(loaded?.revision).toBe(1);
        expect(second.revision).toBe(2);
        expect(recoveries).toContainEqual(
            expect.objectContaining({
                id: 'previous:indexed-project',
                reason: 'previous-valid',
                sourceRevision: 1
            })
        );
        secondRepository.close();
    });
});
