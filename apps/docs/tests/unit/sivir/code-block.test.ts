import { describe, expect, it } from 'vitest';
import { highlight } from '@sivir-ui/svelte/components/code-block/highlight';

describe('CodeBlock highlighting safety', () => {
	it('escapes markup for an unknown language', () => {
		const html = highlight('<script>alert("xss")</script> & text', 'unknown');

		expect(html).toContain('&lt;script&gt;');
		expect(html).toContain('&lt;/script&gt;');
		expect(html).toContain('&amp; text');
		expect(html).not.toContain('<script>');
	});

	it('keeps source tags escaped when syntax highlighting HTML', () => {
		const html = highlight('<img src=x onerror=alert(1)>', 'html');

		expect(html).not.toContain('<img');
		expect(html).toContain('&lt;');
		expect(html).toContain('&gt;');
	});
});
