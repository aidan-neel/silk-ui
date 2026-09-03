import {
    lockBodyBackground,
    lockBodyScroll,
    pushEscapeLayer,
    resetBodyLocksForTests,
    resetEscapeStackForTests
} from '@sivir-ui/svelte/utils';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => {
    resetBodyLocksForTests();
    resetEscapeStackForTests();
    document.body.innerHTML = '';
});

describe('body scroll lock', () => {
    it('locks on first acquire and unlocks on last release', () => {
        const main = document.createElement('main');
        document.body.append(main);

        const releaseA = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');

        const releaseB = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');

        releaseA();
        expect(document.body.style.overflow).toBe('hidden');

        releaseB();
        expect(document.body.style.overflow).toBe('');
    });

    it('restores the overflow value that was present before the first lock', () => {
        document.body.style.overflow = 'scroll';
        const release = lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');
        release();
        expect(document.body.style.overflow).toBe('scroll');
    });

    it('locks nested overflow containers and skips overlay roots', () => {
        const scroller = document.createElement('div');
        scroller.style.overflow = 'auto';
        const overlay = document.createElement('div');
        overlay.setAttribute('data-overlay-root', '');
        overlay.style.overflow = 'auto';
        document.body.append(scroller, overlay);

        const release = lockBodyScroll();
        expect(document.documentElement.style.overflow).toBe('hidden');
        expect(document.body.style.overflow).toBe('hidden');
        expect(scroller.style.overflow).toBe('hidden');
        expect(overlay.style.overflow).toBe('auto');

        release();
        expect(scroller.style.overflow).toBe('auto');
        expect(document.body.style.overflow).toBe('');
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('background lock inerts page branches and skips overlay roots', () => {
        const main = document.createElement('main');
        const floating = document.createElement('div');
        floating.setAttribute('data-floating-content', '');
        const modalPortal = document.createElement('div');
        modalPortal.setAttribute('data-overlay-root', '');
        document.body.append(main, floating, modalPortal);

        const releaseA = lockBodyBackground();
        expect(main.inert).toBe(true);
        expect(floating.inert).not.toBe(true);
        expect(modalPortal.inert).not.toBe(true);

        const releaseB = lockBodyBackground();
        releaseA();
        expect(main.inert).toBe(true);

        releaseB();
        expect(main.inert).toBe(false);
    });
});

describe('escape layer stack', () => {
    it('closes only the topmost layer per Escape', () => {
        const closed: string[] = [];
        const releaseOuter = pushEscapeLayer(() => closed.push('outer'));
        const releaseInner = pushEscapeLayer(() => closed.push('inner'));

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(closed).toEqual(['inner']);

        releaseInner();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(closed).toEqual(['inner', 'outer']);

        releaseOuter();
    });

    it('closes the higher-rank layer even when it registered first', () => {
        const closed: string[] = [];
        const releaseInner = pushEscapeLayer(() => closed.push('inner'), undefined, 2);
        const releaseOuter = pushEscapeLayer(() => closed.push('outer'), undefined, 1);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(closed).toEqual(['inner']);

        releaseInner();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(closed).toEqual(['inner', 'outer']);

        releaseOuter();
    });
});
