import { describe, expect, test } from 'vitest';
import path from 'node:path';
import { assertInsideLab, currentRoot, labTempRoot } from './paths';

describe('safe cleanup boundary', () => {
    test('accepts descendants and rejects the root or escaped paths', () => {
        expect(assertInsideLab(currentRoot)).toBe(path.resolve(currentRoot));
        expect(() => assertInsideLab(labTempRoot)).toThrow('Refusing unsafe');
        expect(() => assertInsideLab(path.join(labTempRoot, '..', 'docs'))).toThrow(
            'Refusing unsafe'
        );
    });
});
