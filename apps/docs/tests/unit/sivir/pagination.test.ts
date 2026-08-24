import Pagination from '@sivir-ui/svelte/components/pagination/pagination.svelte';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { required } from '../../test-utils';

describe('Pagination -- rendering', () => {
    it('renders a nav element with aria-label="Pagination"', () => {
        const { container } = render(Pagination, { props: { page: 1, total: 5 } });
        const nav = container.querySelector('nav[aria-label="Pagination"]');
        expect(nav).toBeInTheDocument();
    });

    it('renders Previous and Next buttons', () => {
        render(Pagination, { props: { page: 3, total: 10 } });
        expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
        expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    it('renders all pages when total is small enough to skip ellipses', () => {
        const { container } = render(Pagination, {
            props: { page: 1, total: 5, siblings: 5 }
        });
        const buttons = Array.from(container.querySelectorAll('button'));
        const pageButtons = buttons.filter((b) => /^\d+$/.test(b.textContent?.trim() ?? ''));
        expect(pageButtons.length).toBe(5);
    });

    it('renders ellipses when the range is wide', () => {
        const { container } = render(Pagination, {
            props: { page: 10, total: 20, siblings: 1 }
        });
        const ellipses = container.querySelectorAll('[aria-hidden="true"]');
        // At least one ellipsis when the page is in the middle.
        expect(ellipses.length).toBeGreaterThanOrEqual(1);
    });
});

describe('Pagination -- current page marker', () => {
    it('sets aria-current="page" on the active page button', () => {
        const { container } = render(Pagination, { props: { page: 3, total: 10 } });
        const current = container.querySelector('button[aria-current="page"]');
        expect(current).toBeInTheDocument();
        expect(current?.textContent?.trim()).toBe('3');
    });

    it('marks page=1 as current when on the first page', () => {
        const { container } = render(Pagination, { props: { page: 1, total: 5 } });
        const current = container.querySelector('button[aria-current="page"]');
        expect(current?.textContent?.trim()).toBe('1');
    });
});

describe('Pagination -- boundary disable', () => {
    it('disables Previous when page=1', () => {
        render(Pagination, { props: { page: 1, total: 10 } });
        expect(screen.getByLabelText('Previous page')).toBeDisabled();
    });

    it('enables Previous when page>1', () => {
        render(Pagination, { props: { page: 2, total: 10 } });
        expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
    });

    it('disables Next when page=total', () => {
        render(Pagination, { props: { page: 10, total: 10 } });
        expect(screen.getByLabelText('Next page')).toBeDisabled();
    });

    it('enables Next when page<total', () => {
        render(Pagination, { props: { page: 5, total: 10 } });
        expect(screen.getByLabelText('Next page')).not.toBeDisabled();
    });
});

describe('Pagination -- interaction', () => {
    it('fires onPageChange when clicking Next', async () => {
        const onPageChange = vi.fn();
        render(Pagination, { props: { page: 1, total: 5, onPageChange } });
        const user = userEvent.setup();
        await user.click(screen.getByLabelText('Next page'));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('fires onPageChange when clicking Previous', async () => {
        const onPageChange = vi.fn();
        render(Pagination, { props: { page: 3, total: 5, onPageChange } });
        const user = userEvent.setup();
        await user.click(screen.getByLabelText('Previous page'));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('fires onPageChange with the clicked page number', async () => {
        const onPageChange = vi.fn();
        const { container } = render(Pagination, {
            props: { page: 1, total: 5, siblings: 5, onPageChange }
        });
        const user = userEvent.setup();
        const buttons = Array.from(container.querySelectorAll('button'));
        const page4 = required(buttons.find((button) => button.textContent?.trim() === '4'));
        await user.click(page4);
        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('does not fire onPageChange when clicking the current page', async () => {
        const onPageChange = vi.fn();
        render(Pagination, {
            props: { page: 3, total: 5, siblings: 5, onPageChange }
        });
        const user = userEvent.setup();
        const current = required(screen.getByText('3').closest('button'));
        await user.click(current);
        expect(onPageChange).not.toHaveBeenCalled();
    });

    it('clamps below 1 (Previous from page=1 is disabled, no callback)', async () => {
        const onPageChange = vi.fn();
        render(Pagination, { props: { page: 1, total: 5, onPageChange } });
        const user = userEvent.setup();
        await user.click(screen.getByLabelText('Previous page'));
        expect(onPageChange).not.toHaveBeenCalled();
    });

    it('clamps above total (Next from page=total is disabled, no callback)', async () => {
        const onPageChange = vi.fn();
        render(Pagination, { props: { page: 5, total: 5, onPageChange } });
        const user = userEvent.setup();
        await user.click(screen.getByLabelText('Next page'));
        expect(onPageChange).not.toHaveBeenCalled();
    });
});

describe('Pagination -- sibling configuration', () => {
    it('siblings=0 renders only the active page when far from boundaries (plus 1 and total + ellipses)', () => {
        const { container } = render(Pagination, {
            props: { page: 10, total: 20, siblings: 0 }
        });
        const buttons = Array.from(container.querySelectorAll('button'));
        const pageButtons = buttons.filter((b) => /^\d+$/.test(b.textContent?.trim() ?? ''));
        // Should have at least: 1, 10, 20.
        expect(pageButtons.map((b) => b.textContent?.trim())).toEqual(
            expect.arrayContaining(['1', '10', '20'])
        );
    });

    it('siblings=2 renders 5 pages around current when away from boundaries', () => {
        const { container } = render(Pagination, {
            props: { page: 10, total: 20, siblings: 2 }
        });
        const buttons = Array.from(container.querySelectorAll('button'));
        const pageButtons = buttons.filter((b) => /^\d+$/.test(b.textContent?.trim() ?? ''));
        // siblings=2 around 10 → 8,9,10,11,12 plus 1 and 20.
        const labels = pageButtons.map((b) => b.textContent?.trim());
        expect(labels).toEqual(expect.arrayContaining(['1', '8', '9', '10', '11', '12', '20']));
    });
});
