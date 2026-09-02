import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), '../../packages/sivir/src/ui.css'), 'utf8');

describe('ui.css Tier 1 primitives', () => {
    it('defines only the neutral steps consumed by components', () => {
        for (const step of [0, 10, 50, 100, 150, 300, 500, 900]) {
            expect(css).toContain(`--sivir-neutral-${step}:`);
        }
        for (const step of [25, 200, 400, 600, 700, 800]) {
            expect(css).not.toContain(`--sivir-neutral-${step}:`);
        }
    });
    it('defines the blue ramp and the density-driven space unit', () => {
        expect(css).toContain('--sivir-blue-500:');
        expect(css).toContain('--sivir-space-unit: 3.6px');
    });
    it('overrides the neutral ramp under .dark', () => {
        const darkBlock = css.slice(css.indexOf('.dark'));
        expect(darkBlock).toContain('--sivir-neutral-0: hsl(0 0% 5%)');
    });
});

describe('ui.css typography tokens', () => {
    it('defines all semantic font-weight roles', () => {
        expect(css).toContain('--font-weight-header: 600;');
        expect(css).toContain('--font-weight-body: 400;');
        expect(css).toContain('--font-weight-label: 500;');
        expect(css).toContain('--font-weight-button: 500;');
        expect(css).toContain('--font-weight-badge: 500;');
        expect(css).toContain('--font-weight-description: 400;');
    });
    it('defines the press motion contract', () => {
        expect(css).toContain('--motion-press-px: var(--size-hairline);');
        expect(css).toContain('--spacing: var(--sivir-space-unit);');
        expect(css).toContain('--size-hairline: 2px;');
        expect(css).toContain('--size-touch: 2.75rem;');
        expect(css).toContain('--opacity-disabled: 0.4;');
        expect(css).toContain('--overlay-gutter: 2rem;');
        expect(css).toContain('--font-size-title: 20px;');
        expect(css).toContain('--leading-body: 1.5;');
        expect(css).toContain('--color-error-soft:');
        expect(css).toContain('--color-primary-stroke: transparent;');
        expect(css).toContain('--ui-cursor-interactive: default;');
        expect(css).toContain('--text-sm: var(--font-size-body);');
        expect(css).toContain('--motion-duration-press: 160ms;');
        expect(css).toContain('--ease-press:');
        expect(css).toContain('.sivir-press:active');
    });
    it('zeroes press duration under reduced motion', () => {
        const reducedBlock = css.slice(css.indexOf('prefers-reduced-motion'));
        expect(reducedBlock).toContain('--motion-duration-press: 0ms;');
    });
});

describe('ui.css Tier 2 semantic', () => {
    it('maps semantic color tokens to neutral/blue primitives', () => {
        expect(css).toContain('--color-background: var(--sivir-neutral-10)');
        expect(css).toContain('--color-card: var(--sivir-neutral-0)');
        expect(css).toContain('--color-primary: #1f9be6');
        expect(css).toContain(
            '--color-ring: color-mix(in srgb, var(--color-primary) 30%, transparent)'
        );
    });
    it('keeps canonical semantics and drops the retired aliases (consumers migrated)', () => {
        // Real semantic tokens stay.
        expect(css).toContain('--color-error:');
        expect(css).toContain('--color-panel:');
        expect(css).toContain('--color-info:');
        // Pure pass-through aliases were removed; consumers now read the canonical names.
        expect(css).not.toContain('--color-destructive:');
        expect(css).not.toContain('--color-modal:');
        expect(css).not.toContain('--color-panel-foreground:');
    });
});

describe('ui.css Tier 3 + structure', () => {
    it('keeps component defaults out of the public theme contract', () => {
        expect(css).not.toMatch(
            /^\s*--(?:button|badge|field|panel|card|menu|command|tooltip|switch|checkbox|toast|tabs|progress|modal|sheet|textarea|breadcrumb|toggle|shortcut|slider)-/m
        );
    });
    it('sizes controls from the spacing scale', () => {
        expect(css).toMatch(/--size-control-md:.*var\(--sivir-space-/);
    });
    it('keeps reduced-motion while excluding global rules and component keyframes', () => {
        expect(css).not.toContain('@layer base');
        expect(css).not.toMatch(/(^|})\s*\*\s*\{/);
        expect(css).not.toContain('@keyframes');
        expect(css).toContain('prefers-reduced-motion: reduce');
    });
    it('prevents iOS input zoom without disabling page zoom', () => {
        expect(css).toContain('@media (max-width: 767px)');
        expect(css).toContain('font-size: 16px;');
        expect(css).not.toContain('user-scalable=no');
    });
    /** Mirrors the budget in packages/sivir/release.test.ts -- keep the two in step. */
    it('stays within the release size budget', () => {
        const normalizedCss = css.replace(/\s+/g, ' ').trim();
        expect(css.split('\n').length).toBeLessThanOrEqual(520);
        expect(Buffer.byteLength(normalizedCss)).toBeLessThanOrEqual(16 * 1024);
    });

    it('declares the shared surface contracts in the components layer', () => {
        expect(css).toContain('@layer components');
        for (const contract of [
            '.sivir-menu-item',
            '.sivir-card-frame',
            '.sivir-card-surface',
            '.sivir-modal-frame',
            '.sivir-inset-frame',
            '.sivir-inset-surface',
            '.sivir-tooltip',
            '.sivir-overlay-scrim',
            '.sivir-menu-label',
            '.sivir-menu-separator',
            '.sivir-error-notice'
        ]) {
            expect(css).toContain(contract);
        }
    });
});
