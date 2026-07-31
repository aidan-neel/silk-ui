import { afterEach, describe, expect, it } from 'vitest';
import {
	lockBodyBackground,
	lockBodyScroll,
	pushEscapeLayer,
	resetBodyLocksForTests,
	resetEscapeStackForTests
} from '@sivir-ui/svelte/utils';

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

	it('background lock skips floating overlays and clears only when idle', () => {
		const main = document.createElement('main');
		const floating = document.createElement('div');
		floating.setAttribute('data-floating-content', '');
		const modalPortal = document.createElement('div');
		modalPortal.setAttribute('data-overlay-root', '');
		document.body.append(main, floating, modalPortal);

		const releaseA = lockBodyBackground();
		expect(main.classList.contains('pointer-events-none')).toBe(true);
		expect(floating.classList.contains('pointer-events-none')).toBe(false);
		expect(modalPortal.classList.contains('pointer-events-none')).toBe(false);

		const releaseB = lockBodyBackground();
		releaseA();
		expect(main.classList.contains('pointer-events-none')).toBe(true);

		releaseB();
		expect(main.classList.contains('pointer-events-none')).toBe(false);
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
});
