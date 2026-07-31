import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	toast,
	__setActiveToastStateForTests,
	__getActiveToastStateForTests
} from '@sivir-ui/svelte/components/toast/lib.svelte.ts';
import NestedToasterFixture from '../../fixtures/NestedToasterFixture.svelte';
import ToasterFixture from '../../fixtures/ToasterFixture.svelte';

beforeEach(() => {
	cleanup();
	__setActiveToastStateForTests(undefined);
});

afterEach(() => {
	cleanup();
	__setActiveToastStateForTests(undefined);
});

describe('Toaster shared client stack', () => {
	it('keeps nested and outer Toasters on one shared stack', async () => {
		const view = render(NestedToasterFixture, { showNested: true });

		toast({ title: 'nested', persistent: true });
		expect(__getActiveToastStateForTests()?.data.toasts.map((t) => t.title)).toEqual(['nested']);

		await view.rerender({ showNested: false });

		expect(__getActiveToastStateForTests()).toBeDefined();
		toast({ title: 'outer', persistent: true });
		expect(__getActiveToastStateForTests()?.data.toasts.map((t) => t.title)).toEqual([
			'nested',
			'outer'
		]);
	});

	it('preserves the stack across page Toaster remounts', () => {
		const pageA = render(ToasterFixture);
		toast({ title: 'page A', persistent: true });
		expect(__getActiveToastStateForTests()?.data.toasts.map((t) => t.title)).toEqual(['page A']);
		pageA.unmount();

		const pageB = render(ToasterFixture);
		// Layout-style gap: store survives with no active host, then rejoins.
		toast({ title: 'page B', persistent: true });
		expect(__getActiveToastStateForTests()?.data.toasts.map((t) => t.title)).toEqual([
			'page A',
			'page B'
		]);
		pageB.unmount();
	});

	it('renders only one notification region when multiple Toasters mount', () => {
		render(NestedToasterFixture, { showNested: true });
		toast({ title: 'once', persistent: true });

		const regions = document.querySelectorAll('[aria-label="Notifications"]');
		expect(regions.length).toBe(1);
	});

	it('portals the stack onto document.body', () => {
		render(ToasterFixture);
		toast({ title: 'ported', persistent: true });

		const region = document.querySelector('[aria-label="Notifications"]');
		expect(region?.parentElement?.parentElement).toBe(document.body);
	});
});
