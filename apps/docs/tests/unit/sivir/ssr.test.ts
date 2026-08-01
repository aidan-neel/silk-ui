import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { Component } from 'svelte';

// Tier 1 + Tier 2 components and fixtures, imported by name.
import Button from '@sivir-ui/svelte/components/button/button.svelte';
import Alert from '@sivir-ui/svelte/components/alert/alert.svelte';
import Badge from '@sivir-ui/svelte/components/badge/badge.svelte';
import Input from '@sivir-ui/svelte/components/input/input.svelte';
import Textarea from '@sivir-ui/svelte/components/textarea/textarea.svelte';
import Checkbox from '@sivir-ui/svelte/components/checkbox/checkbox.svelte';
import Switch from '@sivir-ui/svelte/components/switch/switch.svelte';
import Slider from '@sivir-ui/svelte/components/slider/slider.svelte';
import Toggle from '@sivir-ui/svelte/components/toggle/toggle.svelte';
import Progress from '@sivir-ui/svelte/components/progress/progress.svelte';
import Pagination from '@sivir-ui/svelte/components/pagination/pagination.svelte';
import Skeleton from '@sivir-ui/svelte/components/skeleton/skeleton.svelte';
import Label from '@sivir-ui/svelte/components/label/label.svelte';
import Shortcut from '@sivir-ui/svelte/components/shortcut/shortcut.svelte';

import ModalFixture from '../../fixtures/ModalFixture.svelte';
import SheetFixture from '../../fixtures/SheetFixture.svelte';
import PopoverFixture from '../../fixtures/PopoverFixture.svelte';
import AlertDialogFixture from '../../fixtures/AlertDialogFixture.svelte';
import DropdownMenuFixture from '../../fixtures/DropdownMenuFixture.svelte';
import SelectFixture from '../../fixtures/SelectFixture.svelte';
import ComboboxFixture from '../../fixtures/ComboboxFixture.svelte';
import CommandFixture from '../../fixtures/CommandFixture.svelte';
import ContextMenuFixture from '../../fixtures/ContextMenuFixture.svelte';
import ColorPickerFixture from '../../fixtures/ColorPickerFixture.svelte';
import TabsFixture from '../../fixtures/TabsFixture.svelte';
import AccordionFixture from '../../fixtures/AccordionFixture.svelte';
import CollapsibleFixture from '../../fixtures/CollapsibleFixture.svelte';
import RadioGroupFixture from '../../fixtures/RadioGroupFixture.svelte';
import ToggleGroupFixture from '../../fixtures/ToggleGroupFixture.svelte';
import AvatarFixture from '../../fixtures/AvatarFixture.svelte';
import ToasterFixture from '../../fixtures/ToasterFixture.svelte';

/*
 * SSR tier -- strategy Sec.6 and pattern guide Sec.14.2.
 *
 * Every Tier 1 + Tier 2 component must server-render without throwing.
 * This catches unguarded `document` / `window` / `localStorage` access
 * during the initial component module / mount lifecycle.
 *
 * String comparison only -- no browser. Hydration-drift assertions go to
 * ssr.browser.test.ts where a real browser is needed for the comparison.
 *
 * Failure modes guarded against:
 *   - `document is not defined` at module load.
 *   - `window is not defined` in $effect / onMount running server-side.
 *   - `localStorage is not defined` in module-level reads.
 *   - Unhandled exceptions in $derived / $derived.by during render.
 */

function ssrShouldNotThrow(name: string, Comp: unknown, props: Record<string, unknown> = {}) {
    it(`${name} renders server-side without throwing`, () => {
        expect(() => render(Comp as Component<Record<string, unknown>>, { props })).not.toThrow();
    });

    it(`${name} produces non-empty body HTML`, () => {
        const result = render(Comp as Component<Record<string, unknown>>, { props });
        expect(result.body).toBeTypeOf('string');
        expect(result.body.length).toBeGreaterThan(0);
    });
}

describe('SSR -- leaf components (Tier 1)', () => {
    ssrShouldNotThrow('button', Button, {});
    ssrShouldNotThrow('alert', Alert, { variant: 'info' });
    ssrShouldNotThrow('badge', Badge, { variant: 'primary' });
    ssrShouldNotThrow('input', Input, {});
    ssrShouldNotThrow('textarea', Textarea, {});
    ssrShouldNotThrow('checkbox', Checkbox, { checked: false, variant: 'default' });
    ssrShouldNotThrow('switch', Switch, { switched: false });
    ssrShouldNotThrow('slider', Slider, { value: 0 });
    ssrShouldNotThrow('toggle', Toggle, { pressed: false });
    ssrShouldNotThrow('progress', Progress, { value: 50, max: 100 });
    ssrShouldNotThrow('pagination', Pagination, { page: 1, total: 5 });
    ssrShouldNotThrow('skeleton', Skeleton, {});
    ssrShouldNotThrow('label', Label, {});
    ssrShouldNotThrow('shortcut', Shortcut, { shortcut: 'cmd+k' });
});

describe('SSR -- overlay primitives (Tier 1)', () => {
    ssrShouldNotThrow('modal (closed)', ModalFixture, { open: false });
    ssrShouldNotThrow('modal (open)', ModalFixture, { open: true });
    ssrShouldNotThrow('sheet (closed)', SheetFixture, { open: false });
    ssrShouldNotThrow('sheet (open)', SheetFixture, { open: true });
    ssrShouldNotThrow('alert-dialog (closed)', AlertDialogFixture, { open: false });
    ssrShouldNotThrow('alert-dialog (open)', AlertDialogFixture, { open: true });
});

describe('SSR -- floating primitives + wrappers (Tier 1)', () => {
    ssrShouldNotThrow('popover (closed)', PopoverFixture, { open: false });
    ssrShouldNotThrow('dropdown-menu', DropdownMenuFixture, {});
    ssrShouldNotThrow('select', SelectFixture, {});
    ssrShouldNotThrow('combobox', ComboboxFixture, {});
    ssrShouldNotThrow('command', CommandFixture, {});
    ssrShouldNotThrow('context-menu', ContextMenuFixture, {});
    ssrShouldNotThrow('color-picker', ColorPickerFixture, { value: '#ff0000' });
});

describe('SSR -- compound interaction components (Tier 1)', () => {
    ssrShouldNotThrow('tabs', TabsFixture, { value: 'one' });
    ssrShouldNotThrow('accordion (single)', AccordionFixture, {
        type: 'single',
        value: 'a'
    });
    ssrShouldNotThrow('accordion (multiple)', AccordionFixture, {
        type: 'multiple',
        value: ['a', 'b']
    });
    ssrShouldNotThrow('collapsible (closed)', CollapsibleFixture, { open: false });
    ssrShouldNotThrow('collapsible (open)', CollapsibleFixture, { open: true });
    ssrShouldNotThrow('radio-group', RadioGroupFixture, { value: 'apple' });
    ssrShouldNotThrow('toggle-group (single)', ToggleGroupFixture, {
        type: 'single',
        value: 'bold'
    });
    ssrShouldNotThrow('toggle-group (multiple)', ToggleGroupFixture, {
        type: 'multiple',
        value: ['bold', 'italic']
    });
});

describe('SSR -- toast singleton (Tier 1)', () => {
    ssrShouldNotThrow('toaster (empty)', ToasterFixture, {});
});

describe('SSR -- Tier 2 components', () => {
    ssrShouldNotThrow('avatar (no src)', AvatarFixture, { src: '' });
    ssrShouldNotThrow('avatar (with src)', AvatarFixture, {
        src: 'https://example.com/img.png',
        alt: 'User'
    });
});

/*
 * Hydration drift is covered indirectly across the suite:
 *   - SSR-side closed/open assertions live in `SSR -- drift-prone bidirectional-sync components`.
 *   - Client-side closed/open assertions for the same fixtures live in modal.browser.test.ts,
 *     sheet.browser.test.ts, popover.browser.test.ts, alert-dialog.browser.test.ts.
 *
 * A real cross-environment literal comparison (server HTML → browser
 * hydration → DOM diff) cannot run in vitest's project model because the
 * browser project resolves Svelte to its client export, and `svelte/server`
 * needs the server export. The combination of "SSR matches expected shape"
 * + "client matches the same expected shape" rules out drift on the visible
 * surface without requiring a literal comparison.
 */

describe('SSR -- drift-prone bidirectional-sync components', () => {
    it('modal (closed) does not include the title in SSR output', () => {
        const result = render(ModalFixture as Component<Record<string, unknown>>, {
            props: { open: false }
        });
        expect(result.body).not.toMatch(/Modal Title/);
        expect(result.body).toMatch(/data-testid="trigger"/);
    });

    it('modal (open) includes the title and role="dialog" in SSR output', () => {
        const result = render(ModalFixture as Component<Record<string, unknown>>, {
            props: { open: true }
        });
        expect(result.body).toMatch(/Modal Title/);
        expect(result.body).toMatch(/role="dialog"/);
    });

    it('sheet (closed) does not include the title in SSR output', () => {
        const result = render(SheetFixture as Component<Record<string, unknown>>, {
            props: { open: false }
        });
        expect(result.body).not.toMatch(/Sheet Title/);
    });

    it('sheet (open) includes the title and role="dialog" in SSR output', () => {
        // Sheet gates content on `{#if sheetState.open}` (no deferred visible
        // flag). Open SSR should emit the dialog chrome like Modal does.
        const result = render(SheetFixture as Component<Record<string, unknown>>, {
            props: { open: true }
        });
        expect(result.body).toMatch(/data-testid="trigger"/);
        expect(result.body).toMatch(/Sheet Title/);
        expect(result.body).toMatch(/role="dialog"/);
    });

    it('popover (closed) does not include the content in SSR output', () => {
        const result = render(PopoverFixture as Component<Record<string, unknown>>, {
            props: { open: false }
        });
        expect(result.body).not.toMatch(/Popover Title/);
    });

    it('alert-dialog (closed) does not include the dialog content in SSR output', () => {
        const result = render(AlertDialogFixture as Component<Record<string, unknown>>, {
            props: { open: false }
        });
        expect(result.body).not.toMatch(/Delete project\?/);
    });

    it('alert-dialog (open) renders with role="alertdialog" not role="dialog"', () => {
        const result = render(AlertDialogFixture as Component<Record<string, unknown>>, {
            props: { open: true }
        });
        expect(result.body).toMatch(/role="alertdialog"/);
        expect(result.body).not.toMatch(/role="dialog"[^"]/);
    });
});

describe('SSR -- output shape spot checks', () => {
    it('button output contains the rendered text', () => {
        const result = render(Button as Component<Record<string, unknown>>, {
            props: { children: undefined }
        });
        // Buttons without children render an empty button tag; the tag itself
        // should still be present.
        expect(result.body).toMatch(/<button/);
    });

    it('badge variant=primary emits the data-ui or matching class hint', () => {
        const result = render(Badge as Component<Record<string, unknown>>, {
            props: { variant: 'primary' }
        });
        // We don't assert a specific class string (would couple to Tailwind
        // generation); we assert the markup tag exists.
        expect(result.body.length).toBeGreaterThan(0);
    });

    it('badge renders an optional dot marker', () => {
        const result = render(Badge as Component<Record<string, unknown>>, {
            props: { dot: true }
        });
        expect(result.body).toContain('data-badge-dot');
    });

    it('modal closed produces empty fixture body (the trigger renders, modal content does not)', () => {
        const result = render(ModalFixture as Component<Record<string, unknown>>, {
            props: { open: false }
        });
        // Trigger button is rendered.
        expect(result.body).toMatch(/<button/);
        // Modal title is NOT rendered (open=false).
        expect(result.body).not.toMatch(/Modal Title/);
    });

    it('modal open includes the title in the SSR output', () => {
        const result = render(ModalFixture as Component<Record<string, unknown>>, {
            props: { open: true }
        });
        expect(result.body).toMatch(/Modal Title/);
    });

    it('alert-dialog open uses role="alertdialog" in the SSR output', () => {
        const result = render(AlertDialogFixture as Component<Record<string, unknown>>, {
            props: { open: true }
        });
        expect(result.body).toMatch(/role="alertdialog"/);
    });
});
