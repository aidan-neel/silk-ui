import { describe, expect, it } from 'vitest';
import { cn } from '@sivir-ui/svelte/utils';

/*
 * Sivir's `cn` is `twMerge(clsx(inputs.reverse()))` -- the `.reverse()`
 * means the FIRST argument wins on Tailwind conflicts (inverted from
 * the shadcn convention). Sivir components use `cn(className, ...rest)`
 * so consumer overrides come first and win. This is intentional;
 * `cn(consumer-override, library-base)` is the documented call shape.
 */

describe('cn', () => {
    it('joins string args (output order reflects reverse + clsx)', () => {
        expect(cn('a', 'b', 'c')).toBe('c b a');
    });

    it('drops falsy args', () => {
        expect(cn('a', false, null, undefined, '', 'b')).toBe('b a');
    });

    it('flattens arrays', () => {
        expect(cn(['a', 'b'], 'c')).toBe('c a b');
    });

    it('respects clsx object syntax', () => {
        expect(cn({ a: true, b: false, c: true })).toBe('a c');
    });

    it('first argument wins on Tailwind conflicts (sivir-specific)', () => {
        expect(cn('px-2', 'px-4')).toBe('px-2');
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-red-500');
    });

    it('keeps non-conflicting Tailwind classes from both sides', () => {
        const result = cn('px-2 text-sm', 'py-1 font-bold');
        expect(result).toContain('px-2');
        expect(result).toContain('text-sm');
        expect(result).toContain('py-1');
        expect(result).toContain('font-bold');
    });

    it('component convention: cn(classProp, variantStyle) -- classProp wins on conflicts', () => {
        const classProp = 'px-6 text-lg';
        const variantStyle = 'flex items-center px-3 py-2 text-sm';
        const result = cn(classProp, variantStyle);
        expect(result).toContain('px-6');
        expect(result).toContain('text-lg');
        expect(result).toContain('flex');
        expect(result).toContain('items-center');
        expect(result).toContain('py-2');
        expect(result).not.toContain('px-3');
        expect(result).not.toContain('text-sm');
    });

    it('preserves arbitrary-value Tailwind classes', () => {
        expect(cn('text-[var(--color-primary)]')).toBe('text-[var(--color-primary)]');
    });

    it('first arbitrary-value class wins on conflict', () => {
        expect(cn('text-[10px]', 'text-[12px]')).toBe('text-[10px]');
    });

    it('handles empty input', () => {
        expect(cn()).toBe('');
    });

    it('handles only falsy input', () => {
        expect(cn(false, null, undefined, '')).toBe('');
    });

    it('does not deduplicate non-conflicting identical literal strings', () => {
        expect(cn('custom-marker', 'custom-marker')).toBe('custom-marker custom-marker');
    });
});
