import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

const CODE = 'const value = 1;';

function copyButtons(container: HTMLElement): HTMLButtonElement[] {
    return [...container.querySelectorAll('button')].filter((button) => {
        return button.getAttribute('aria-label')?.toLowerCase().includes('copy');
    }) as HTMLButtonElement[];
}

function expectCopyButtonMorph(button: HTMLButtonElement) {
    // CopyButton's icon morph: two icons sharing one grid cell.
    const morph = button.querySelector('span.relative.grid');
    expect(morph).not.toBeNull();
}

describe('CodeBlock copy buttons are CopyButton', () => {
    it('actionbar placement renders one CopyButton for a single snippet', () => {
        const { container } = render(CodeBlock.Root, {
            props: { code: CODE, lang: 'ts', copy: 'actionbar' }
        });

        const buttons = copyButtons(container);
        expect(buttons).toHaveLength(1);
        expectCopyButtonMorph(buttons[0]);
    });

    it('actionbar placement renders one CopyButton for tabbed snippets', () => {
        const { container } = render(CodeBlock.Root, {
            props: {
                value: 'a',
                tabs: [
                    { label: 'A', lang: 'a', code: 'aaa' },
                    { label: 'B', lang: 'b', code: 'bbb' }
                ]
            }
        });

        const buttons = copyButtons(container);
        expect(buttons).toHaveLength(1);
        expectCopyButtonMorph(buttons[0]);
    });

    it('overlay placement renders one CopyButton', () => {
        const { container } = render(CodeBlock.Root, {
            props: { code: CODE, lang: 'ts', copy: 'overlay' }
        });

        const buttons = copyButtons(container);
        expect(buttons).toHaveLength(1);
        expectCopyButtonMorph(buttons[0]);
    });

    it('inline placement renders one CopyButton', () => {
        const { container } = render(CodeBlock.Root, {
            props: { code: 'bunx sivir add code-block', lang: 'bash', copy: 'inline' }
        });

        const buttons = copyButtons(container);
        expect(buttons).toHaveLength(1);
        expectCopyButtonMorph(buttons[0]);
    });

    it('standalone CopyButton matches the code-block copy structure', () => {
        const { container } = render(CopyButton, { props: { text: CODE } });
        const buttons = copyButtons(container);
        expect(buttons).toHaveLength(1);
        expectCopyButtonMorph(buttons[0]);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
