import { describe, expect, it } from 'vitest';
import { CATALOG_FAMILIES } from '../catalog/types';
import { SAMPLE_DOCUMENT } from './sample';
import { parseDesignDocument, safeParseDesignDocument } from './schema';

type MutableNode = {
    id?: string;
    kind: string;
    layout?: string;
    layoutStyle?: unknown;
    children?: string[];
    props?: Record<string, unknown>;
    style: Record<string, Record<string, string>>;
};

type MutableDocument = {
    appearance: {
        theme: Record<string, unknown>;
    };
    nodes: Record<string, MutableNode>;
};

function mutableSample(): MutableDocument {
    return structuredClone(SAMPLE_DOCUMENT) as unknown as MutableDocument;
}

describe('Sivir Design document schema', () => {
    it('accepts the sample and covers every supported catalog family', () => {
        const document = parseDesignDocument(SAMPLE_DOCUMENT);
        const families = new Set(
            Object.values(document.nodes)
                .filter((node) => node.kind === 'component')
                .map((node) => node.family)
        );

        expect([...families].sort()).toEqual([...CATALOG_FAMILIES].sort());
        expect(document).not.toBe(SAMPLE_DOCUMENT);
    });

    it('rejects unknown responsive scopes', () => {
        const document = mutableSample();
        document.nodes['page-root'].style.padding.xl = '12';
        const result = safeParseDesignDocument(document);

        expect(result.success).toBe(false);
        expect(result.success ? [] : result.issues.map((issue) => issue.code)).toContain(
            'object.unknown-key'
        );
    });

    it('rejects unsafe component URLs and unsafe theme font syntax', () => {
        const document = mutableSample();
        const avatar = document.nodes['profile-avatar'];

        if (!avatar.props) {
            throw new Error('Avatar fixture is missing props.');
        }

        avatar.props.src = 'javascript:alert(1)';
        document.appearance.theme.fontSans = "Inter; background: url('https://example.com')";
        const result = safeParseDesignDocument(document);

        expect(result.success).toBe(false);

        if (result.success) {
            return;
        }

        expect(result.issues.map((issue) => issue.code)).toEqual(
            expect.arrayContaining(['component.prop', 'theme.unsafe-font'])
        );
    });

    it('rejects cycles instead of repairing the semantic tree', () => {
        const document = mutableSample();
        const root = document.nodes['page-root'];

        if (!root.children) {
            throw new Error('Page fixture is missing children.');
        }

        root.children.push('page-root');
        const result = safeParseDesignDocument(document);

        expect(result.success).toBe(false);
        expect(result.success ? [] : result.issues.map((issue) => issue.code)).toContain(
            'node.cycle'
        );
    });

    it('rejects disconnected cycles as unreachable and cyclic', () => {
        const document = mutableSample();
        const pageRoot = document.nodes['page-root'];
        document.nodes['detached-a'] = {
            id: 'detached-a',
            kind: 'layout',
            layout: 'stack',
            children: ['detached-b'],
            style: structuredClone(pageRoot.style),
            layoutStyle: structuredClone(pageRoot.layoutStyle)
        };
        document.nodes['detached-b'] = {
            id: 'detached-b',
            kind: 'layout',
            layout: 'stack',
            children: ['detached-a'],
            style: structuredClone(pageRoot.style),
            layoutStyle: structuredClone(pageRoot.layoutStyle)
        };
        const result = safeParseDesignDocument(document);

        expect(result.success).toBe(false);
        expect(result.success ? [] : result.issues.map((issue) => issue.code)).toEqual(
            expect.arrayContaining(['node.unreachable', 'node.cycle'])
        );
    });
});
