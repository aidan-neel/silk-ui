import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import AttachmentFixture from '../../fixtures/AttachmentFixture.svelte';
import { queryRequired } from '../../test-utils';

async function chooseFiles(input: HTMLInputElement, files: File[]) {
    Object.defineProperty(input, 'files', { configurable: true, value: files });
    await fireEvent.change(input);
}

describe('Attachment', () => {
    it('adds accepted files and removes the rendered item', async () => {
        const { container } = render(AttachmentFixture);
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['release notes'], 'release-notes.txt', {
            type: 'text/plain',
            lastModified: 1
        });

        await chooseFiles(input, [file]);

        expect(screen.getByRole('list', { name: 'Attachments' })).toBeInTheDocument();
        expect(screen.getByText('release-notes.txt')).toBeInTheDocument();
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('1');
        await userEvent
            .setup()
            .click(screen.getByRole('button', { name: 'Remove release-notes.txt' }));

        await waitFor(() => {
            expect(screen.queryByText('release-notes.txt')).not.toBeInTheDocument();
            expect(screen.queryByRole('list', { name: 'Attachments' })).not.toBeInTheDocument();
        });
    });

    it('rejects an invalid file type with a typed code', async () => {
        const { container } = render(AttachmentFixture, { props: { accept: '.txt' } });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['report'], 'report.pdf', {
            type: 'application/pdf',
            lastModified: 2
        });

        await chooseFiles(input, [file]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent(
            'report.pdf:file-invalid-type'
        );
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('0');
    });

    it('rejects an oversized file with a typed code', async () => {
        const { container } = render(AttachmentFixture, { props: { maxSize: 4 } });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['12345'], 'large.txt', { type: 'text/plain', lastModified: 3 });

        await chooseFiles(input, [file]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent('large.txt:file-too-large');
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('0');
    });

    it('rejects a duplicate file with a typed code', async () => {
        const { container } = render(AttachmentFixture);
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['same'], 'same.txt', { type: 'text/plain', lastModified: 4 });

        await chooseFiles(input, [file]);
        await chooseFiles(input, [file]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent('same.txt:duplicate-file');
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('1');
    });

    it('rejects files beyond the maximum count with a typed code', async () => {
        const { container } = render(AttachmentFixture, { props: { maxFiles: 1 } });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const first = new File(['one'], 'one.txt', { type: 'text/plain', lastModified: 5 });
        const second = new File(['two'], 'two.txt', { type: 'text/plain', lastModified: 6 });

        await chooseFiles(input, [first, second]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent('two.txt:too-many-files');
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('1');
        expect(screen.getByText('one.txt')).toBeInTheDocument();
    });
});
