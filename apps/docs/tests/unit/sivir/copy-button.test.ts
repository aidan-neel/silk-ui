import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CopyButton from '@sivir/ui/components/copy-button/copy-button.svelte';

function setClipboard(writeText: (text: string) => Promise<void>) {
	Object.defineProperty(navigator, 'clipboard', {
		configurable: true,
		value: { writeText }
	});
}

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('CopyButton clipboard behavior', () => {
	it('writes the exact text, updates its label, and calls oncopy', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const oncopy = vi.fn();
		setClipboard(writeText);

		render(CopyButton, { props: { text: '<safe & exact>', oncopy } });
		await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

		await waitFor(() => expect(writeText).toHaveBeenCalledWith('<safe & exact>'));
		expect(oncopy).toHaveBeenCalledWith('<safe & exact>');
		expect(screen.getByRole('button')).toHaveAccessibleName('Copied');
	});

	it('does not report success when the clipboard rejects', async () => {
		const writeText = vi.fn().mockRejectedValue(new Error('permission denied'));
		const oncopy = vi.fn();
		setClipboard(writeText);

		render(CopyButton, { props: { text: 'secret', oncopy } });
		await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

		await waitFor(() => expect(writeText).toHaveBeenCalledWith('secret'));
		expect(oncopy).not.toHaveBeenCalled();
		expect(screen.getByRole('button')).toHaveAccessibleName('Copy');
	});

	it('falls back to the document copy command when clipboard access is denied', async () => {
		const writeText = vi.fn().mockRejectedValue(new Error('permission denied'));
		const oncopy = vi.fn();
		setClipboard(writeText);
		Object.defineProperty(document, 'execCommand', {
			configurable: true,
			value: vi.fn().mockReturnValue(true)
		});

		render(CopyButton, { props: { text: 'fallback text', oncopy } });
		await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

		await waitFor(() => expect(oncopy).toHaveBeenCalledWith('fallback text'));
		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});
});
