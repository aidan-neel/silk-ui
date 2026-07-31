import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import ResponseStream from '@sivir-ui/svelte/components/response-stream/response-stream.svelte';

async function* chunks() {
	yield 'First ';
	yield 'chunk';
}

describe('ResponseStream', () => {
	it('renders live chunks as soon as they arrive', async () => {
		const { container } = render(ResponseStream, {
			props: { textStream: chunks(), mode: 'fade', speed: 1 }
		});

		await waitFor(() => expect(container).toHaveTextContent('First chunk'));
		const segment = container.querySelector<HTMLSpanElement>('.sivir-response-stream-segment');
		expect(segment?.style.getPropertyValue('--response-stream-segment-delay')).toBe('0ms');
	});
});
