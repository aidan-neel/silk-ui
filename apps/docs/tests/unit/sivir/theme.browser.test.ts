import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_THEME, neutralTemperatures, themeToCss } from '@sivir-ui/svelte/themes/theme';

const PARITY_PROPERTIES = [
    '--font-sans',
    '--font-mono',
    '--font-header',
    '--radius-sm',
    '--radius-md',
    '--radius-lg',
    '--radius-xl',
    '--sivir-space-unit',
    '--motion-duration-hover',
    '--motion-duration-menu',
    '--motion-duration-panel',
    '--motion-duration-sheet',
    '--motion-duration-overlay',
    '--motion-duration-toast-in',
    '--motion-duration-toast-out',
    '--color-primary',
    '--color-primary-hover',
    '--sivir-blue-50',
    '--sivir-blue-500',
    ...([0, 10, 50, 100, 150, 300, 500, 900].map((step) => `--sivir-neutral-${step}`) as string[])
];

function values(mode: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    const styles = getComputedStyle(document.documentElement);
    return Object.fromEntries(
        PARITY_PROPERTIES.map((property) => [property, styles.getPropertyValue(property).trim()])
    );
}

function install(css: string) {
    const style = document.createElement('style');
    style.dataset.testTheme = 'true';
    style.textContent = css;
    document.head.appendChild(style);
}

afterEach(() => {
    document.documentElement.classList.remove('dark');
    document.querySelectorAll('[data-test-theme]').forEach((node) => node.remove());
});

describe('theme computed styles', () => {
    it('keeps generated DEFAULT_THEME in computed-style parity with baked ui.css', () => {
        const bakedLight = values('light');
        const bakedDark = values('dark');
        install(themeToCss(DEFAULT_THEME));

        expect(values('light')).toEqual(bakedLight);
        expect(values('dark')).toEqual(bakedDark);
    });

    it('resolves every neutral temperature to usable light and dark colors', () => {
        const probe = document.createElement('div');
        document.body.appendChild(probe);
        for (const neutral of neutralTemperatures) {
            install(themeToCss({ ...DEFAULT_THEME, neutral }));
            for (const mode of ['light', 'dark'] as const) {
                document.documentElement.classList.toggle('dark', mode === 'dark');
                for (const step of [0, 10, 50, 100, 150, 300, 500, 900]) {
                    probe.style.color = `var(--sivir-neutral-${step})`;
                    expect(getComputedStyle(probe).color).toMatch(/^rgb/);
                }
            }
            document.querySelectorAll('[data-test-theme]').forEach((node) => node.remove());
        }
        probe.remove();
    });
});
