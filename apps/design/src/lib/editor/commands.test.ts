import { describe, expect, it } from 'vitest';
import { stableStringify } from '../document/portable';
import { SAMPLE_DOCUMENT } from '../document/sample';
import { applyDesignCommand } from './commands';
import {
    createDesignHistory,
    executeDesignCommand,
    redoDesignCommand,
    undoDesignCommand
} from './history';

describe('immutable design commands', () => {
    it('returns an inverse without mutating the source document', () => {
        const before = stableStringify(SAMPLE_DOCUMENT);
        const applied = applyDesignCommand(SAMPLE_DOCUMENT, {
            type: 'set-text',
            nodeId: 'brand-heading',
            text: 'Account settings'
        });

        expect(stableStringify(SAMPLE_DOCUMENT)).toBe(before);
        expect(applied.document.nodes['brand-heading']).toMatchObject({
            kind: 'text',
            text: 'Account settings'
        });

        const reverted = applyDesignCommand(applied.document, applied.inverse);
        expect(stableStringify(reverted.document)).toBe(before);
    });

    it('sets and removes sparse responsive overrides', () => {
        const applied = applyDesignCommand(SAMPLE_DOCUMENT, {
            type: 'set-responsive-value',
            nodeId: 'settings-content',
            group: 'layoutStyle',
            property: 'columns',
            breakpoint: 'lg',
            value: '3'
        });
        const node = applied.document.nodes['settings-content'];

        if (node.kind !== 'layout') {
            throw new Error('Grid fixture must be a layout node.');
        }

        expect(node.layoutStyle.columns.lg).toBe('3');
        const reverted = applyDesignCommand(applied.document, applied.inverse);
        const revertedNode = reverted.document.nodes['settings-content'];

        expect(revertedNode.kind === 'layout' ? revertedNode.layoutStyle.columns.lg : null).toBe(
            undefined
        );
    });

    it('duplicates a complete subtree with caller-supplied deterministic IDs', () => {
        const applied = applyDesignCommand(SAMPLE_DOCUMENT, {
            type: 'duplicate-subtree',
            nodeId: 'status-badge',
            idMap: {
                'status-badge': 'status-badge-copy',
                'status-badge-text': 'status-badge-text-copy'
            },
            location: {
                parentId: 'header-container',
                slot: null,
                index: 2
            }
        });
        const parent = applied.document.nodes['header-container'];

        expect(parent.kind === 'layout' ? parent.children.at(-1) : null).toBe('status-badge-copy');
        expect(applied.document.nodes['status-badge-copy']).toMatchObject({
            family: 'badge',
            slots: { content: ['status-badge-text-copy'] }
        });

        const reverted = applyDesignCommand(applied.document, applied.inverse);
        expect(stableStringify(reverted.document)).toBe(stableStringify(SAMPLE_DOCUMENT));
    });
});

describe('bounded undo and redo', () => {
    it('coalesces a transaction into one history entry', () => {
        let history = createDesignHistory(SAMPLE_DOCUMENT, 'brand-heading');
        history = executeDesignCommand(
            history,
            { type: 'set-text', nodeId: 'brand-heading', text: 'A' },
            { transactionId: 'heading-edit' }
        );
        history = executeDesignCommand(
            history,
            { type: 'set-text', nodeId: 'brand-heading', text: 'AB' },
            { transactionId: 'heading-edit' }
        );

        expect(history.past).toHaveLength(1);
        history = undoDesignCommand(history);
        expect(stableStringify(history.document)).toBe(stableStringify(SAMPLE_DOCUMENT));
        history = redoDesignCommand(history);
        expect(history.document.nodes['brand-heading']).toMatchObject({ text: 'AB' });
    });

    it('replays one hundred edits to the same content hashes', () => {
        let history = createDesignHistory(SAMPLE_DOCUMENT, 'brand-heading');

        for (let index = 0; index < 100; index += 1) {
            history = executeDesignCommand(history, {
                type: 'set-text',
                nodeId: 'brand-heading',
                text: `Heading ${index}`
            });
        }

        const finalHash = stableStringify(history.document);

        for (let index = 0; index < 100; index += 1) {
            history = undoDesignCommand(history);
        }

        expect(stableStringify(history.document)).toBe(stableStringify(SAMPLE_DOCUMENT));

        for (let index = 0; index < 100; index += 1) {
            history = redoDesignCommand(history);
        }

        expect(stableStringify(history.document)).toBe(finalHash);
    });

    it('drops the oldest entries when configured bounds are reached', () => {
        let history = createDesignHistory(SAMPLE_DOCUMENT, null, {
            maxEntries: 2,
            maxBytes: 1_000_000
        });

        for (const text of ['One', 'Two', 'Three']) {
            history = executeDesignCommand(history, {
                type: 'set-text',
                nodeId: 'brand-heading',
                text
            });
        }

        expect(history.past).toHaveLength(2);
        history = undoDesignCommand(undoDesignCommand(history));
        expect(history.document.nodes['brand-heading']).toMatchObject({ text: 'One' });
    });
});
