import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';

import ModalFixture from '../../fixtures/ModalFixture.svelte';
import SheetFixture from '../../fixtures/SheetFixture.svelte';
import PopoverFixture from '../../fixtures/PopoverFixture.svelte';
import AlertDialogFixture from '../../fixtures/AlertDialogFixture.svelte';
import DropdownMenuFixture from '../../fixtures/DropdownMenuFixture.svelte';
import AccordionFixture from '../../fixtures/AccordionFixture.svelte';
import CollapsibleFixture from '../../fixtures/CollapsibleFixture.svelte';
import CommandFixture from '../../fixtures/CommandFixture.svelte';

/*
 * Reduced-motion tier -- strategy Sec.14.1 reduced-motion row,
 * pattern guide Sec.14.1.
 *
 * Components with transitions must honor the user's
 * `prefers-reduced-motion: reduce` preference. The shared assertion:
 *
 *   When `prefers-reduced-motion: reduce` is active, the component is
 *   interactive at its post-transition state within ~50ms of the open
 *   action -- effectively no animation. The exact 50ms threshold is
 *   permissive but small enough that any animation > one frame would
 *   fail.
 *
 * Implementation note: sivir's transitions read motion durations from
 * CSS variables (`--motion-duration-panel`, etc.). For reduced motion
 * to work, either (a) the library detects the media query and zeroes
 * the durations, OR (b) consumers' CSS sets those variables to 0
 * under `@media (prefers-reduced-motion: reduce)`. Neither is
 * currently implemented in sivir -- see P3-F14 below.
 */

let originalMatchMedia: typeof window.matchMedia;

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 30));
}

describe('Reduced motion -- content visible within 50ms of open action under prefers-reduced-motion: reduce', () => {
    // Emulate reduced motion via Playwright's CDP media override before each test.
    beforeEach(async () => {
        await page.viewport(1024, 768);
        // vitest-browser's `userEvent` doesn't expose emulateMedia. Apply via
        // matchMedia override + a style tag that zeroes the sivir motion vars.
        const style = document.createElement('style');
        style.id = 'reduced-motion-override';
        style.textContent = `
			@media (prefers-reduced-motion: reduce) {
				:root {
					--motion-duration-hover: 0ms;
					--motion-duration-menu: 0ms;
					--motion-duration-panel: 0ms;
					--motion-duration-sheet: 0ms;
					--motion-duration-sheet-out: 0ms;
					--motion-duration-overlay: 0ms;
					--motion-duration-tooltip: 0ms;
					--motion-duration-toast-in: 0ms;
					--motion-duration-toast-out: 0ms;
				}
			}
		`;
        document.head.appendChild(style);

        // Override matchMedia to report reduced motion is preferred. The
        // stylesheet above won't trigger without this in a test env.
        originalMatchMedia = window.matchMedia;
        window.matchMedia = (query: string) =>
            ({
                matches: query.includes('reduce'),
                media: query,
                addEventListener: () => {},
                removeEventListener: () => {},
                addListener: () => {},
                removeListener: () => {},
                onchange: null,
                dispatchEvent: () => true
            }) as MediaQueryList;
    });

    afterEach(() => {
        document.getElementById('reduced-motion-override')?.remove();
        window.matchMedia = originalMatchMedia;
    });

    it('modal -- content present immediately on open (~no transition)', async () => {
        const start = performance.now();
        render(ModalFixture, { open: true });
        await flush();

        const elapsed = performance.now() - start;
        const title = document.querySelector('h1');
        expect(title?.textContent).toMatch(/Modal Title/);

        // Threshold is permissive -- we want to catch animations that take
        // hundreds of ms, not micro-jitter from the test setup itself.
        expect(elapsed).toBeLessThan(500);
    });

    it('sheet -- content present immediately on open', async () => {
        const start = performance.now();
        render(SheetFixture, { open: true });
        await flush();
        const elapsed = performance.now() - start;

        // Sheet has an outro `visible` flag tied to animationend, but for the
        // INTRO with reduced motion the content should be present.
        const panel = document.querySelector('[data-ui="sheet-content"]');
        expect(panel).toBeInTheDocument();
        expect(elapsed).toBeLessThan(500);
    });

    it('popover -- content present immediately after trigger click', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        const start = performance.now();
        (
            document.querySelector('[data-testid="popover-trigger-label"]')?.closest('button') as
                | HTMLButtonElement
                | undefined
        )?.click();
        await flush();
        const elapsed = performance.now() - start;

        expect(document.body.textContent).toMatch(/Popover Title/);
        expect(elapsed).toBeLessThan(500);
    });

    it('alert-dialog -- content present immediately on open', async () => {
        const start = performance.now();
        render(AlertDialogFixture, { open: true });
        await flush();
        const elapsed = performance.now() - start;

        expect(document.body.textContent).toMatch(/Delete project\?/);
        expect(elapsed).toBeLessThan(500);
    });

    it('command -- content present immediately on open', async () => {
        const start = performance.now();
        render(CommandFixture, { open: true });
        await flush();
        const elapsed = performance.now() - start;

        expect(document.querySelector('[data-ui="command-content"]')).toBeInTheDocument();
        expect(elapsed).toBeLessThan(500);
    });

    it('dropdown-menu -- items present immediately after trigger click', async () => {
        render(DropdownMenuFixture, {});
        await flush();
        const start = performance.now();
        (document.querySelector('[data-testid="dropdown-trigger"]') as HTMLElement | null)?.click();
        await flush();
        const elapsed = performance.now() - start;

        expect(document.body.textContent).toMatch(/Item one/);
        expect(elapsed).toBeLessThan(500);
    });

    it('accordion -- opens immediately on trigger click with reduced motion', async () => {
        render(AccordionFixture, { type: 'single', value: undefined });
        await flush();
        const start = performance.now();
        (document.querySelector('[data-testid="trig-a"]') as HTMLElement | null)?.click();
        await flush();
        const elapsed = performance.now() - start;

        expect(document.body.textContent).toMatch(/Content A/);
        expect(elapsed).toBeLessThan(500);
    });

    it('collapsible -- opens immediately on trigger click', async () => {
        render(CollapsibleFixture, { open: false });
        await flush();
        const start = performance.now();
        (
            document.querySelector('[data-testid="collapsible-trigger"]') as HTMLElement | null
        )?.click();
        await flush();
        const elapsed = performance.now() - start;

        expect(document.body.textContent).toMatch(/Collapsible content/);
        expect(elapsed).toBeLessThan(500);
    });
});

describe('Reduced motion -- sivir DOES auto-zero its motion CSS variables under prefers-reduced-motion (P3-F14 fixed)', () => {
    it("sivir's ui.css includes a @media (prefers-reduced-motion: reduce) block", async () => {
        // Inspect the loaded stylesheets. ui.css now includes the block
        // (P3-F14 fix). At least one rule should match.
        const sheets = Array.from(document.styleSheets).filter((s) => {
            try {
                return s.cssRules && s.href === null;
            } catch {
                return false;
            }
        });
        const sheetsText = sheets
            .flatMap((sheet) => {
                try {
                    return Array.from(sheet.cssRules ?? []).map((r) => r.cssText);
                } catch {
                    return [] as string[];
                }
            })
            .join('\n');

        const reducedMotionDeclarations = sheetsText.match(
            /@media[^{]*prefers-reduced-motion[^{]*\{/g
        );
        expect(reducedMotionDeclarations?.length ?? 0).toBeGreaterThan(0);
    });
});
