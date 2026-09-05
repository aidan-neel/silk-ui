import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CustomThemeStylesheet from '../../../src/routes/docs/components/code-block/examples/custom-theme-stylesheet.svelte';
import CustomThemeVariables from '../../../src/routes/docs/components/code-block/examples/custom-theme-variables.svelte';

describe('CodeBlock custom theme examples', () => {
    it('renders the stylesheet example without built-in token variables', () => {
        const { container } = render(CustomThemeStylesheet);

        const root = container.querySelector('[data-ui="code-block"]');
        expect(root?.className).not.toContain('code-block-token-');
        expect(root?.className).toContain('demo-hljs-onedark');
        expect(root).toHaveTextContent('getUser');
    });

    it('renders the variables example with the built-in token variables', () => {
        const { container } = render(CustomThemeVariables);

        const root = container.querySelector('[data-ui="code-block"]');
        expect(root?.className).toContain('code-block-token-keyword');
        expect(container.querySelector('.demo-brand-tokens')).not.toBeNull();
        expect(root).toHaveTextContent('getUser');
    });
});
