import { describe, expect, it } from 'vitest';
import {
    exportPortableProject,
    importPortableProject,
    PortableProjectError,
    stableStringify
} from './portable';
import { SAMPLE_DOCUMENT } from './sample';

describe('portable project JSON', () => {
    it('round-trips to byte-stable canonical JSON', () => {
        const first = exportPortableProject(SAMPLE_DOCUMENT);
        const imported = importPortableProject(first);
        const second = exportPortableProject(imported.document);

        expect(second).toBe(first);
        expect(first.endsWith('\n')).toBe(true);
        expect(stableStringify(imported.document)).toBe(stableStringify(SAMPLE_DOCUMENT));
    });

    it('rejects unknown envelope fields', () => {
        const envelope = JSON.parse(exportPortableProject(SAMPLE_DOCUMENT)) as Record<
            string,
            unknown
        >;
        envelope.executable = 'not allowed';

        expect(() => importPortableProject(JSON.stringify(envelope))).toThrowError(
            PortableProjectError
        );
    });

    it('sorts object keys without changing array order', () => {
        expect(stableStringify({ z: 1, a: [3, 2, 1] }, 0)).toBe('{"a":[3,2,1],"z":1}');
    });
});
