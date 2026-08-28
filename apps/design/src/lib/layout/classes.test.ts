import { describe, expect, it } from 'vitest';
import { SAMPLE_DOCUMENT } from '../document/sample';
import { nodeClassNames, resolveResponsiveValue, TAILWIND_CLASS_MAPS } from './classes';

describe('literal responsive class maps', () => {
    it('inherits sparse base, medium, and large values', () => {
        const value = { base: '1', md: '2' } as const;

        expect(resolveResponsiveValue(value, 'base')).toBe('1');
        expect(resolveResponsiveValue(value, 'md')).toBe('2');
        expect(resolveResponsiveValue(value, 'lg')).toBe('2');
    });

    it('emits literal mobile-first classes in stable property order', () => {
        const grid = SAMPLE_DOCUMENT.nodes['settings-content'];

        if (grid.kind !== 'layout') {
            throw new Error('Grid fixture must be a layout node.');
        }

        const classes = nodeClassNames(grid);
        expect(classes).toContain('grid-cols-1');
        expect(classes).toContain('md:grid-cols-2');
        expect(classes).toContain('lg:gap-6');
        expect(classes).toEqual(nodeClassNames(grid));
    });

    it('contains no runtime Tailwind class templates', () => {
        const serialized = JSON.stringify(TAILWIND_CLASS_MAPS);

        expect(serialized).not.toContain('${');
        expect(serialized).toContain('max-w-screen-2xl');
        expect(serialized).toContain('border-border-strong');
    });
});
