import '@sivir-ui/svelte/ui.css';
import { afterEach, beforeEach } from 'vitest';
import { resetBodyLocksForTests, resetEscapeStackForTests } from '@sivir-ui/svelte/utils';

function resetBrowserState() {
	document.documentElement.classList.remove('dark');
	resetBodyLocksForTests();
	resetEscapeStackForTests();
}

beforeEach(resetBrowserState);
afterEach(resetBrowserState);
