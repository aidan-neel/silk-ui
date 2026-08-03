import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { lintTree } from '../../../../../tools/token-lint/index';

describe('token-lint enforcement', () => {
    it('components contain no un-disabled literal/primitive violations', () => {
        const v = lintTree(resolve(process.cwd(), '../../packages/sivir/src/components'));
        expect(v, JSON.stringify(v, null, 2)).toHaveLength(0);
    });
});
