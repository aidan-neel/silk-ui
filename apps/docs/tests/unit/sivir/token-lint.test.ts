import { describe, expect, it } from 'vitest';
import { lintSource } from '../../../../../tools/token-lint/index';

describe('lintSource', () => {
    it('flags a hardcoded hex color', () => {
        const v = lintSource('a.svelte', 'class="bg-[#ff0000]"');
        expect(v).toHaveLength(1);
        expect(v[0].rule).toBe('no-literal-color');
    });

    it('flags a hardcoded px length in an arbitrary value', () => {
        const v = lintSource('a.svelte', 'class="h-[2px]"');
        expect(v.map((x) => x.rule)).toContain('no-literal-length');
    });

    it('flags direct use of a Tier-1 primitive', () => {
        const v = lintSource('a.svelte', 'class="text-[var(--sivir-neutral-900)]"');
        expect(v.map((x) => x.rule)).toContain('no-primitive-leak');
    });

    it('passes clean token-only usage', () => {
        const v = lintSource(
            'a.svelte',
            'class="bg-[var(--color-card)] rounded-[var(--radius-lg)]"'
        );
        expect(v).toEqual([]);
    });

    it('reports the correct line number for a violation on a later line', () => {
        // only scans the text it is handed; reports 1-based line numbers
        const v = lintSource('a.svelte', 'line1\nclass="h-[8px]"');
        expect(v[0].line).toBe(2);
    });

    it('does NOT flag a length that only appears as a var() fallback', () => {
        expect(lintSource('a.svelte', 'class="[font-size:var(--font-size-body,16px)]"')).toEqual(
            []
        );
    });

    it('does NOT flag a color that only appears as a var() fallback', () => {
        expect(lintSource('a.svelte', 'class="border-[var(--x,#ffffff)]"')).toEqual([]);
    });

    it('still flags a real length literal sitting outside var()', () => {
        const v = lintSource('a.svelte', 'class="shadow-[0_0_0_3px_var(--color-ring)]"');
        expect(v.map((x) => x.rule)).toContain('no-literal-length');
    });

    it('does NOT flag component-scoped --sivir-<name>- vars (only primitive families)', () => {
        const v = lintSource('a.svelte', 'animation: x var(--sivir-marquee-duration) linear;');
        expect(v).toEqual([]);
    });

    it('skips the whole file when token-lint-disable-file is present', () => {
        const v = lintSource(
            'a.svelte',
            '<!-- token-lint-disable-file -->\nclass="bg-[#ff0000] h-[2px]"'
        );
        expect(v).toEqual([]);
    });

    it('DOES flag real primitive families', () => {
        for (const p of ['--sivir-neutral-200', '--sivir-blue-500', '--sivir-space-4']) {
            expect(
                lintSource('a.svelte', `x: var(${p})`).some((y) => y.rule === 'no-primitive-leak')
            ).toBe(true);
        }
    });

    it('honors an inline disable directive on the same line', () => {
        const v = lintSource(
            'a.svelte',
            'style="background:#000000" /* token-lint-disable-line no-literal-color */'
        );
        expect(v).toEqual([]);
    });

    it('honors a disable-next-line directive', () => {
        const v = lintSource(
            'a.svelte',
            '<!-- token-lint-disable-next-line -->\nstyle="background:#000"'
        );
        expect(v).toEqual([]);
    });
});
