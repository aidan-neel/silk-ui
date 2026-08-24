import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AvatarFixture from '../../fixtures/AvatarFixture.svelte';
import { queryRequired } from '../../test-utils';

describe('Avatar -- rendering', () => {
    it('renders the root wrapper with data-ui="avatar"', () => {
        const { container } = render(AvatarFixture, { props: {} });
        expect(container.querySelector('[data-ui="avatar"]')).toBeInTheDocument();
    });

    it('shows the fallback when no src is provided', () => {
        render(AvatarFixture, { props: { src: '' } });
        expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });

    it("shows the fallback initially when src is provided (image hasn't loaded yet)", () => {
        render(AvatarFixture, { props: { src: 'https://example.com/img.png', alt: 'User' } });
        // Before onload fires, imageLoaded is false → fallback renders.
        expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });
});

describe('Avatar -- image load coordination', () => {
    it('hides the fallback once the image fires onload', async () => {
        const { container } = render(AvatarFixture, {
            props: { src: 'https://example.com/img.png', alt: 'User' }
        });
        const img = queryRequired(container, 'img');
        expect(img).toBeInTheDocument();

        // Dispatch a load event to simulate the image loading.
        img.dispatchEvent(new Event('load'));

        await waitFor(() => {
            expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
        });
    });

    it('shows the fallback again when the image fires onerror', async () => {
        const { container } = render(AvatarFixture, {
            props: { src: 'https://example.com/bad.png', alt: 'User' }
        });
        const img = queryRequired(container, 'img');
        // First simulate load (hides fallback).
        img.dispatchEvent(new Event('load'));
        await waitFor(() => {
            expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
        });

        // Then simulate an error event.
        img.dispatchEvent(new Event('error'));

        await waitFor(() => {
            expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
        });
    });

    it('removes the <img> from the DOM after an error', async () => {
        const { container } = render(AvatarFixture, {
            props: { src: 'https://example.com/bad.png', alt: 'User' }
        });
        const img = queryRequired(container, 'img');
        img.dispatchEvent(new Event('error'));

        await waitFor(() => {
            expect(container.querySelector('img')).toBeNull();
        });
    });
});

describe('Avatar -- size prop wiring', () => {
    it.each(['sm', 'md', 'lg', 'xl'] as const)('accepts size=%s without throwing', (size) => {
        const { container } = render(AvatarFixture, { props: { size } });
        expect(container.querySelector('[data-ui="avatar"]')).toBeInTheDocument();
    });
});

describe('Avatar -- shape prop wiring', () => {
    it('applies a rounded-full class for circle shape', () => {
        const { container } = render(AvatarFixture, { props: { shape: 'circle' } });
        const root = queryRequired(container, '[data-ui="avatar"]');
        expect(root.className).toContain('rounded-full');
    });

    it('does not apply rounded-full for square shape', () => {
        const { container } = render(AvatarFixture, { props: { shape: 'square' } });
        const root = queryRequired(container, '[data-ui="avatar"]');
        expect(root.className).not.toContain('rounded-full');
    });
});

describe('Avatar -- alt text', () => {
    it('forwards alt to the image element', () => {
        const { container } = render(AvatarFixture, {
            props: { src: 'https://example.com/u.png', alt: 'Profile of Jane' }
        });
        expect(container.querySelector('img')?.getAttribute('alt')).toBe('Profile of Jane');
    });
});
