import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import ReorderListFixture from '../../fixtures/ReorderListFixture.svelte';

describe('ReorderList pointer reordering', () => {
    it('moves and commits a row dragged over another row', async () => {
        render(ReorderListFixture);

        await userEvent.dragAndDrop(
            page.getByRole('button', { name: 'First' }),
            page.getByRole('button', { name: 'Third' })
        );

        await expect
            .element(page.getByRole('status', { name: 'Order' }))
            .toHaveTextContent('two,one,three');
        await expect.element(page.getByRole('status', { name: 'Commits' })).toHaveTextContent('1');
    });
});
