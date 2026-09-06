<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import CreditCard from '@lucide/svelte/icons/credit-card';
    import FileText from '@lucide/svelte/icons/file-text';
    import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
    import LifeBuoy from '@lucide/svelte/icons/life-buoy';
    import LogOut from '@lucide/svelte/icons/log-out';
    import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
    import Palette from '@lucide/svelte/icons/palette';
    import Plus from '@lucide/svelte/icons/plus';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import Search from '@lucide/svelte/icons/search';
    import Settings from '@lucide/svelte/icons/settings';
    import User from '@lucide/svelte/icons/user';
    import * as Accordion from '@sivir-ui/svelte/components/accordion';
    import * as Alert from '@sivir-ui/svelte/components/alert';
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';
    import * as Combobox from '@sivir-ui/svelte/components/combobox';
    import * as Command from '@sivir-ui/svelte/components/command';
    import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import { Gauge } from '@sivir-ui/svelte/components/gauge';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { Pagination } from '@sivir-ui/svelte/components/pagination';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { Progress, type ProgressProps } from '@sivir-ui/svelte/components/progress';
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
    import * as Select from '@sivir-ui/svelte/components/select';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import { Slider, type SliderProps } from '@sivir-ui/svelte/components/slider';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { TaskSteps } from '@sivir-ui/svelte/components/task-steps';
    import { Textarea } from '@sivir-ui/svelte/components/textarea';
    import { toast } from '@sivir-ui/svelte/components/toast';
    import { Toolbar } from '@sivir-ui/svelte/components/toolbar';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
    import {
        applyLiveThemeCss,
        loadStudioTheme,
        saveStudioTheme
    } from '@sivir-ui/svelte/themes/live';
    import {
        DEFAULT_THEME,
        densities,
        motionFeels,
        radiusScales,
        type Theme,
        themeToCss
    } from '@sivir-ui/svelte/themes/theme';
    import { mode, setMode } from 'mode-watcher';
    import { onMount } from 'svelte';
    import { fonts } from '$lib/fonts.svelte';
    import {
        type AnimationTokenDefinition,
        type AnimationTokenName,
        animationTokenDefinitions,
        animationTokenGroups,
        type ColorTokenDefinition,
        type ColorTokenName,
        colorTokenDefinitions,
        colorTokenGroups,
        easingOptions,
        formatCssColor,
        formatMs,
        formatPx,
        formatScale,
        matchingEase,
        normalizeEase,
        parseCssColor,
        parseDurationMs,
        parsePxLength,
        parseScale,
        type SpacingTokenDefinition,
        type SpacingTokenName,
        spacingTokenDefinitions,
        spacingTokenGroups
    } from '$lib/studio-advanced-tokens';

    type FoundationPalette = {
        base: string;
        border: string;
        background: string;
        secondary: string;
        foreground: string;
        foregroundMuted: string;
        onPrimary: string;
    };

    type FoundationColors = {
        light: FoundationPalette;
        dark: FoundationPalette;
    };

    type BrandColors = {
        light: string;
        dark: string;
    };

    type InteractiveCursor = 'default' | 'pointer';

    type StudioExtensions = {
        presetSlug: string;
        headerSize: number;
        headerWeight: FontWeight;
        roleWeights: RoleWeights;
        brandColors: BrandColors;
        foundationColors: FoundationColors;
        advancedTokens: AdvancedTokens;
        surfaceShadows: boolean;
        controlShadows: boolean;
        dialogShadows: boolean;
        travelingHighlight: boolean;
        primaryStroke: boolean;
        interactiveCursor: InteractiveCursor;
    };

    type AdvancedTab = 'colors' | 'spacing' | 'animation';
    type FontWeight = '400' | '500' | '600' | '700';

    type RoleWeights = {
        body: FontWeight;
        label: FontWeight;
        button: FontWeight;
        badge: FontWeight;
        description: FontWeight;
    };

    const STUDIO_EXTENSIONS_KEY = 'sivir-studio-extensions-v1';
    const DEFAULT_FOUNDATION_COLORS: FoundationColors = {
        light: {
            base: '#ffffff',
            border: '#e8e8e6',
            background: '#fdfdfc',
            secondary: '#efefee',
            foreground: '#1c1c1b',
            foregroundMuted: '#737373',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#171717',
            border: '#2a2a2a',
            background: '#0a0a0a',
            secondary: '#252525',
            foreground: '#ededed',
            foregroundMuted: '#a3a3a3',
            onPrimary: '#ffffff'
        }
    };
    const DEFAULT_ROLE_WEIGHTS: RoleWeights = {
        body: '400',
        label: '500',
        button: '500',
        badge: '500',
        description: '400'
    };
    const fontWeights = ['400', '500', '600', '700'] as const;
    const cursorChoices = ['default', 'pointer'] as const;

    const brandSwatches = [
        { label: 'Sivir blue', value: '#1e78e6' },
        { label: 'Graphite', value: '#4d607f' },
        { label: 'Grove', value: '#2f7a54' },
        { label: 'Linen', value: '#a44a2f' },
        { label: 'Violet', value: '#7457d9' }
    ];
    const baseSwatches = [
        { label: 'White', value: '#ffffff' },
        { label: 'Porcelain', value: '#fafaf9' },
        { label: 'Graphite', value: '#202020' },
        { label: 'Ink', value: '#171717' }
    ];
    const borderSwatches = [
        { label: 'Mist', value: '#e8e8e6' },
        { label: 'Silver', value: '#d4d4d2' },
        { label: 'Graphite', value: '#3a3a3a' },
        { label: 'Charcoal', value: '#2a2a2a' }
    ];
    const backgroundSwatches = [
        { label: 'Canvas', value: '#fdfdfc' },
        { label: 'Cloud', value: '#f7f7f5' },
        { label: 'Slate', value: '#111318' },
        { label: 'Night', value: '#0a0a0a' }
    ];
    const secondarySwatches = [
        { label: 'Soft', value: '#efefee' },
        { label: 'Stone', value: '#e7e5e4' },
        { label: 'Smoke', value: '#303030' },
        { label: 'Carbon', value: '#252525' }
    ];
    const foregroundSwatches = [
        { label: 'Ink', value: '#1c1c1b' },
        { label: 'Charcoal', value: '#3a3a3a' },
        { label: 'Mist', value: '#a3a3a3' },
        { label: 'Snow', value: '#ededed' }
    ];
    const onPrimarySwatches = [
        { label: 'White', value: '#ffffff' },
        { label: 'Porcelain', value: '#fafaf9' },
        { label: 'Ink', value: '#1c1c1b' },
        { label: 'Night', value: '#0a0a0a' }
    ];

    type AdvancedTokens = {
        colors: Record<'light' | 'dark', Partial<Record<ColorTokenName, string>>>;
        spacing: Partial<Record<SpacingTokenName, string>>;
        animation: Partial<Record<AnimationTokenName, string>>;
    };

    function toFontOption(font: (typeof fonts)[number]) {
        return {
            key: font.name.toLowerCase().replaceAll(' ', '-'),
            label: font.name,
            value: font.family
        };
    }

    const sansFonts = fonts.filter((font) => font.category === 'Sans serif').map(toFontOption);
    const serifFonts = fonts.filter((font) => font.category === 'Serif').map(toFontOption);
    const monoFonts = fonts.filter((font) => font.category === 'Monospace').map(toFontOption);
    const headerFonts = [
        { key: 'same-as-sans', label: 'Same as sans', value: 'var(--font-sans)' },
        ...serifFonts,
        ...sansFonts
    ];
    const themeAxes = [
        'brand',
        'neutral',
        'radius',
        'density',
        'motion',
        'fontSans',
        'fontMono',
        'fontHeader'
    ] as const;
    const radiusValues = {
        sharp: '6px lg',
        default: '10px lg',
        rounded: '18px lg'
    } as const;
    const radiusTokenNames = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl'] as const;
    const densityValues = {
        compact: '3.2px',
        default: '3.6px',
        comfortable: '4px'
    } as const;
    type InvoiceStatus = 'Paid' | 'Due soon' | 'Overdue' | 'Sent' | 'Draft';
    type Invoice = {
        client: string;
        initials: string;
        reference: string;
        due: string;
        amount: string;
        status: InvoiceStatus;
    };
    const INVOICE_PAGE_SIZE = 4;
    const initialInvoices: Invoice[] = [
        {
            client: 'Northwind Trading',
            initials: 'NT',
            reference: 'INV-2291',
            due: 'Sep 12',
            amount: '$12,400',
            status: 'Paid'
        },
        {
            client: 'Halcyon Studio',
            initials: 'HS',
            reference: 'INV-2288',
            due: 'Sep 14',
            amount: '$3,150',
            status: 'Due soon'
        },
        {
            client: 'Kestrel Logistics',
            initials: 'KL',
            reference: 'INV-2279',
            due: 'Aug 28',
            amount: '$9,860',
            status: 'Overdue'
        },
        {
            client: 'Mercury Goods',
            initials: 'MG',
            reference: 'INV-2274',
            due: 'Sep 18',
            amount: '$6,720',
            status: 'Sent'
        },
        {
            client: 'Assembly Works',
            initials: 'AW',
            reference: 'INV-2268',
            due: 'Sep 21',
            amount: '$4,280',
            status: 'Draft'
        },
        {
            client: 'Riverline Press',
            initials: 'RP',
            reference: 'INV-2261',
            due: 'Sep 24',
            amount: '$2,940',
            status: 'Sent'
        },
        {
            client: 'Oak & Pine',
            initials: 'OP',
            reference: 'INV-2254',
            due: 'Aug 19',
            amount: '$7,110',
            status: 'Overdue'
        },
        {
            client: 'Fieldwork Labs',
            initials: 'FL',
            reference: 'INV-2248',
            due: 'Sep 28',
            amount: '$5,600',
            status: 'Due soon'
        }
    ];
    let theme = $state<Theme>({
        ...DEFAULT_THEME,
        slug: 'midnight-ledger',
        name: 'Midnight Ledger'
    });
    let baseTheme = $state<Theme>({ ...DEFAULT_THEME });
    let selectedPreset = $state(DEFAULT_THEME.slug);
    let previousPreset = $state(DEFAULT_THEME.slug);
    let previousRadius: Theme['radius'] = theme.radius;
    let previousDensity: Theme['density'] = theme.density;
    let selectedSans = $state('inter');
    let previousSans = $state('inter');
    let selectedHeader = $state('same-as-sans');
    let previousHeader = $state('same-as-sans');
    let selectedMono = $state('jetbrains-mono');
    let previousMono = $state('jetbrains-mono');
    let headerSize = $state(16);
    let headerWeight = $state<FontWeight>('600');
    let roleWeights = $state<RoleWeights>({ ...DEFAULT_ROLE_WEIGHTS });
    let foundationColors = $state<FoundationColors>({
        light: { ...DEFAULT_FOUNDATION_COLORS.light },
        dark: { ...DEFAULT_FOUNDATION_COLORS.dark }
    });
    let advancedTokens = $state<AdvancedTokens>(emptyAdvancedTokens());
    let brandColors = $state<BrandColors>({ light: '#1e78e6', dark: '#1e78e6' });
    let surfaceShadows = $state(true);
    let controlShadows = $state(true);
    let dialogShadows = $state(true);
    let travelingHighlight = $state(true);
    let primaryStroke = $state(false);
    let interactiveCursor = $state<InteractiveCursor>('default');
    let advancedTab = $state<AdvancedTab>('colors');
    let moreOptionsOpen = $state(false);
    let pendingPreset = $state<string | null>(null);
    let presetDialogOpen = $state(false);
    let studioView = $state('invoices');
    let dashboardRange = $state('30d');
    let invoices = $state<Invoice[]>(initialInvoices.map((invoice) => ({ ...invoice })));
    let invoiceQuery = $state('');
    let invoiceStatus = $state('all');
    let invoicePage = $state(1);
    let invoiceModalOpen = $state(false);
    let newInvoiceCustomer = $state('');
    let newInvoiceNotes = $state('');
    let autoReconcile = $state(true);
    let reminderCadence = $state('weekly');
    let reminderDays = $state(3);
    let companyName = $state('Northstar Ledger');
    let selectedInvoices = $state<Record<string, boolean>>(
        Object.fromEntries(initialInvoices.map((invoice) => [invoice.reference, false]))
    );
    let notifications = $state([
        {
            id: 'overdue',
            title: 'Kestrel Logistics is overdue',
            detail: '$9,860 · INV-2279',
            read: false
        },
        {
            id: 'viewed',
            title: 'Halcyon Studio viewed INV-2288',
            detail: '14 minutes ago',
            read: false
        },
        {
            id: 'paid',
            title: 'Northwind Trading paid INV-2291',
            detail: '$12,400 received',
            read: true
        }
    ]);
    let commandOpen = $state(false);
    let settingsSections = $state<string[]>(['workspace', 'reminders']);
    let copiedKey = $state<'css' | 'json' | null>(null);
    let hydrated = $state(false);
    let appliedDark = $state(false);
    const appMode = $derived(mode.current === 'dark' ? 'dark' : 'light');
    const appModeBinding = {
        get value() {
            return appMode;
        },
        set value(value: string) {
            if (value === 'light' || value === 'dark') {
                setMode(value);
            }
        }
    };
    const visibleInvoices = $derived(
        invoices.filter((invoice) => {
            const query = invoiceQuery.trim().toLowerCase();
            const matchesQuery =
                query === '' ||
                invoice.client.toLowerCase().includes(query) ||
                invoice.reference.toLowerCase().includes(query);
            const matchesStatus =
                invoiceStatus === 'all' ||
                (invoiceStatus === 'open' && invoice.status !== 'Paid') ||
                invoice.status.toLowerCase() === invoiceStatus;

            return matchesQuery && matchesStatus;
        })
    );
    const invoicePageCount = $derived(
        Math.max(1, Math.ceil(visibleInvoices.length / INVOICE_PAGE_SIZE))
    );
    const pagedInvoices = $derived(
        visibleInvoices.slice(
            (invoicePage - 1) * INVOICE_PAGE_SIZE,
            invoicePage * INVOICE_PAGE_SIZE
        )
    );
    const allVisibleSelected = $derived(
        pagedInvoices.length > 0 &&
            pagedInvoices.every((invoice) => selectedInvoices[invoice.reference])
    );
    const unreadNotificationCount = $derived(
        notifications.filter((notification) => !notification.read).length
    );
    const overdueCount = $derived(
        invoices.filter((invoice) => invoice.status === 'Overdue').length
    );
    const outstandingTotal = $derived(
        invoices
            .filter((invoice) => invoice.status !== 'Paid')
            .reduce(
                (sum, invoice) => sum + Number.parseFloat(invoice.amount.replace(/[$,]/g, '')),
                0
            )
    );
    const coverageValue = $derived(
        dashboardRange === '7d' ? 54 : dashboardRange === 'Quarter' ? 81 : 72
    );
    const customers = $derived([...new Set(invoices.map((invoice) => invoice.client))].sort());
    const collectionSteps = [
        { id: 'scan', label: 'Scan overdue', meta: 'Open invoices' },
        { id: 'remind', label: 'Send reminders', meta: 'Today' },
        { id: 'collect', label: 'Record payments' },
        { id: 'reconcile', label: 'Reconcile' }
    ];
    const collectionStep = $derived(autoReconcile ? 2 : 1);

    const foundationColorChanges = $derived(
        (['light', 'dark'] as const).reduce((count, colorMode) => {
            const changedColors = Object.entries(foundationColors[colorMode]).filter(
                ([key, value]) =>
                    value !== DEFAULT_FOUNDATION_COLORS[colorMode][key as keyof FoundationPalette]
            ).length;

            return count + changedColors;
        }, 0)
    );
    const advancedColorChanges = $derived(
        countTokenOverrides(advancedTokens.colors.light) +
            countTokenOverrides(advancedTokens.colors.dark)
    );
    const spacingTokenChanges = $derived(countTokenOverrides(advancedTokens.spacing));
    const animationTokenChanges = $derived(countTokenOverrides(advancedTokens.animation));
    const advancedTokenChanges = $derived(
        advancedColorChanges + spacingTokenChanges + animationTokenChanges
    );
    const roleWeightChanges = $derived(
        Object.entries(roleWeights).filter(
            ([key, value]) => value !== DEFAULT_ROLE_WEIGHTS[key as keyof RoleWeights]
        ).length
    );
    const changedAxisCount = $derived(
        themeAxes.filter((axis) => theme[axis] !== baseTheme[axis]).length +
            (brandColors.light !== baseTheme.brand || brandColors.dark !== baseTheme.brand
                ? 1
                : 0) +
            foundationColorChanges +
            advancedTokenChanges +
            (headerSize === 16 ? 0 : 1) +
            (headerWeight === '600' ? 0 : 1) +
            roleWeightChanges +
            (surfaceShadows ? 0 : 1) +
            (controlShadows ? 0 : 1) +
            (dialogShadows ? 0 : 1) +
            (travelingHighlight ? 0 : 1) +
            (primaryStroke ? 1 : 0) +
            (interactiveCursor === 'default' ? 0 : 1)
    );
    const dirty = $derived(changedAxisCount > 0);
    const generatedCss = $derived(
        `${themeToCss(theme)}\n:root,\n.dark {\n\t--font-size-header: ${headerSize}px;\n\t--font-weight-header: ${headerWeight};\n\t--font-weight-body: ${roleWeights.body};\n\t--font-weight-label: ${roleWeights.label};\n\t--font-weight-button: ${roleWeights.button};\n\t--font-weight-badge: ${roleWeights.badge};\n\t--font-weight-description: ${roleWeights.description};\n}\n${brandCssBlock(':root:not(.dark)', brandColors.light)}${brandCssBlock('.dark', brandColors.dark)}${foundationCssBlock(':root:not(.dark)', foundationColors.light)}${foundationCssBlock('.dark', foundationColors.dark)}${tokenOverridesCssBlock(':root:not(.dark)', advancedTokens.colors.light)}${tokenOverridesCssBlock('.dark', advancedTokens.colors.dark)}${tokenOverridesCssBlock(':root,\n.dark', advancedTokens.spacing)}${tokenOverridesCssBlock(':root,\n.dark', advancedTokens.animation)}${chromeCssBlock()}`
    );
    const generatedJson = $derived(
        JSON.stringify(
            {
                ...theme,
                studio: {
                    presetSlug: selectedPreset,
                    headerSize,
                    headerWeight,
                    roleWeights,
                    brandColors,
                    foundationColors,
                    advancedTokens,
                    surfaceShadows,
                    controlShadows,
                    dialogShadows,
                    travelingHighlight,
                    primaryStroke,
                    interactiveCursor
                },
                css: generatedCss
            },
            null,
            2
        )
    );

    function emptyAdvancedTokens(): AdvancedTokens {
        return {
            colors: { light: {}, dark: {} },
            spacing: {},
            animation: {}
        };
    }

    function countTokenOverrides<T extends string>(overrides: Partial<Record<T, string>>) {
        return (Object.values(overrides) as (string | undefined)[]).filter((value) => value?.trim())
            .length;
    }

    function foundationCssBlock(selector: string, colors: FoundationPalette) {
        const declarations = [
            `--color-card: ${colors.base};`,
            `--color-panel: ${colors.base};`,
            `--color-border: ${colors.border};`,
            `--color-input: ${colors.border};`,
            `--color-background: ${colors.background};`,
            `--color-secondary: ${colors.secondary};`,
            `--color-foreground: ${colors.foreground};`,
            `--color-foreground-muted: ${colors.foregroundMuted};`,
            `--color-on-primary: ${colors.onPrimary};`
        ];

        return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

    function brandCssBlock(selector: string, color: string) {
        const declarations = [
            `--color-primary: ${color};`,
            `--color-primary-hover: color-mix(in srgb, ${color} 78%, black);`,
            `--color-ring: color-mix(in srgb, ${color} 30%, transparent);`
        ];

        return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

    function chromeCssBlock() {
        const shared = [`--ui-cursor-interactive: ${interactiveCursor};`];
        if (!surfaceShadows) {
            shared.push('--elevation-1: none;', '--elevation-float: none;');
        }
        if (!dialogShadows) {
            shared.push('--elevation-modal: none;');
        }
        if (!controlShadows) {
            shared.push(
                '--elevation-control: inset 0 0 0 1px var(--color-border);',
                '--elevation-button-outline: inset 0 0 0 1px var(--color-border);'
            );
        }
        if (!travelingHighlight) {
            shared.push('--sivir-traveling-highlight: none;');
        }
        const light = [
            `--color-primary-stroke: ${
                primaryStroke ? 'color-mix(in srgb, black 14%, transparent)' : 'transparent'
            };`,
            ...shared
        ];
        const dark = [
            `--color-primary-stroke: ${
                primaryStroke ? 'color-mix(in srgb, white 24%, transparent)' : 'transparent'
            };`,
            ...shared
        ];

        return `:root:not(.dark) {\n${light.map((declaration) => `\t${declaration}`).join('\n')}\n}\n.dark {\n${dark.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

    function tokenOverridesCssBlock<T extends string>(
        selector: string,
        overrides: Partial<Record<T, string>>
    ) {
        const entries = Object.entries(overrides) as [string, string | undefined][];
        const declarations = entries
            .filter(
                (entry): entry is [string, string] =>
                    typeof entry[1] === 'string' && entry[1].trim().length > 0
            )
            .map(([name, value]) => `${name}: ${value.trim()};`);
        if (declarations.length === 0) {
            return '';
        }

        return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

    function formatChoice(value: string) {
        if (value === 'comfortable') return 'Comfy';
        if (value === 'expressive') return 'Bold';
        if (value === 'true') return 'True';
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function valueBinding<T extends string>(value: T, onChange: (value: T) => void) {
        return {
            get value() {
                return value;
            },
            set value(nextValue: T) {
                onChange(nextValue);
            }
        };
    }

    function findSansKey(value: string) {
        return sansFonts.find((font) => font.value === value)?.key ?? 'inter';
    }

    function findMonoKey(value: string) {
        return monoFonts.find((font) => font.value === value)?.key ?? 'jetbrains-mono';
    }

    function findHeaderKey(value: string) {
        return headerFonts.find((font) => font.value === value)?.key ?? 'same-as-sans';
    }

    function syncFontSelections(nextTheme: Theme) {
        selectedSans = findSansKey(nextTheme.fontSans);
        previousSans = selectedSans;
        selectedHeader = findHeaderKey(nextTheme.fontHeader);
        previousHeader = selectedHeader;
        selectedMono = findMonoKey(nextTheme.fontMono);
        previousMono = selectedMono;
    }

    function loadStudioExtensions() {
        const raw = localStorage.getItem(STUDIO_EXTENSIONS_KEY);
        if (!raw) return;
        try {
            const value = JSON.parse(raw) as Partial<StudioExtensions>;
            if (typeof value.presetSlug === 'string') {
                const preset = builtInThemePresets.find(
                    (candidate) => candidate.slug === value.presetSlug
                );
                if (preset) {
                    selectedPreset = preset.slug;
                    previousPreset = preset.slug;
                    baseTheme = { ...preset };
                }
            }
            if (typeof value.headerSize === 'number') headerSize = value.headerSize;
            if (value.headerWeight) headerWeight = value.headerWeight;
            if (value.roleWeights) {
                roleWeights = { ...DEFAULT_ROLE_WEIGHTS, ...value.roleWeights };
            }
            if (value.foundationColors) {
                const lightFoundationColors = value.foundationColors.light as FoundationPalette & {
                    muted?: string;
                };
                const darkFoundationColors = value.foundationColors.dark as FoundationPalette & {
                    muted?: string;
                };
                const { muted: _lightMuted, ...light } = lightFoundationColors;
                const { muted: _darkMuted, ...dark } = darkFoundationColors;

                foundationColors = {
                    light: {
                        ...DEFAULT_FOUNDATION_COLORS.light,
                        ...light
                    },
                    dark: {
                        ...DEFAULT_FOUNDATION_COLORS.dark,
                        ...dark
                    }
                };
            }
            if (value.advancedTokens) {
                const lightTokens = {
                    ...value.advancedTokens.colors?.light
                } as Record<string, string | undefined>;
                const darkTokens = {
                    ...value.advancedTokens.colors?.dark
                } as Record<string, string | undefined>;
                const { '--color-muted': _lightMuted, ...light } = lightTokens;
                const { '--color-muted': _darkMuted, ...dark } = darkTokens;

                advancedTokens = {
                    colors: {
                        light,
                        dark
                    },
                    spacing: { ...value.advancedTokens.spacing },
                    animation: { ...value.advancedTokens.animation }
                };
            }
            if (value.brandColors) {
                brandColors = {
                    light: value.brandColors.light ?? baseTheme.brand,
                    dark: value.brandColors.dark ?? baseTheme.brand
                };
            }
            const shadowsOff = (value as { shadows?: unknown }).shadows === false;
            if (typeof value.surfaceShadows === 'boolean') {
                surfaceShadows = value.surfaceShadows;
            } else if (shadowsOff) {
                surfaceShadows = false;
            }
            if (typeof value.controlShadows === 'boolean') {
                controlShadows = value.controlShadows;
            } else if (shadowsOff) {
                controlShadows = false;
            }
            if (typeof value.dialogShadows === 'boolean') {
                dialogShadows = value.dialogShadows;
            } else if (shadowsOff) {
                dialogShadows = false;
            }
            if (typeof value.travelingHighlight === 'boolean') {
                travelingHighlight = value.travelingHighlight;
            }
            if (typeof value.primaryStroke === 'boolean') {
                primaryStroke = value.primaryStroke;
            }
            if (value.interactiveCursor === 'default' || value.interactiveCursor === 'pointer') {
                interactiveCursor = value.interactiveCursor;
            }
        } catch {
            localStorage.removeItem(STUDIO_EXTENSIONS_KEY);
        }
    }

    function saveStudioExtensions() {
        const extensions: StudioExtensions = {
            presetSlug: selectedPreset,
            headerSize,
            headerWeight,
            roleWeights: { ...roleWeights },
            brandColors: { ...brandColors },
            foundationColors: {
                light: { ...foundationColors.light },
                dark: { ...foundationColors.dark }
            },
            advancedTokens: {
                colors: {
                    light: { ...advancedTokens.colors.light },
                    dark: { ...advancedTokens.colors.dark }
                },
                spacing: { ...advancedTokens.spacing },
                animation: { ...advancedTokens.animation }
            },
            surfaceShadows,
            controlShadows,
            dialogShadows,
            travelingHighlight,
            primaryStroke,
            interactiveCursor
        };
        localStorage.setItem(STUDIO_EXTENSIONS_KEY, JSON.stringify(extensions));
    }

    function applyPreset(slug: string) {
        const preset = builtInThemePresets.find((candidate) => candidate.slug === slug);
        if (!preset) return;

        const draftIdentity = {
            slug: theme.slug,
            name: theme.name,
            description: theme.description
        };
        baseTheme = { ...preset };
        theme = { ...preset, ...draftIdentity };
        headerSize = 16;
        headerWeight = '600';
        roleWeights = { ...DEFAULT_ROLE_WEIGHTS };
        foundationColors = {
            light: { ...DEFAULT_FOUNDATION_COLORS.light },
            dark: { ...DEFAULT_FOUNDATION_COLORS.dark }
        };
        advancedTokens = emptyAdvancedTokens();
        brandColors = { light: preset.brand, dark: preset.brand };
        surfaceShadows =
            preset.chrome?.shadows !== false && preset.chrome?.surfaceShadows !== false;
        controlShadows =
            preset.chrome?.shadows !== false && preset.chrome?.controlShadows !== false;
        dialogShadows = preset.chrome?.shadows !== false && preset.chrome?.dialogShadows !== false;
        travelingHighlight = preset.chrome?.travelingHighlight !== false;
        primaryStroke = false;
        interactiveCursor = 'default';
        syncFontSelections(theme);
    }

    function resetTheme() {
        theme = {
            ...baseTheme,
            slug: theme.slug,
            name: theme.name,
            description: theme.description
        };
        headerSize = 16;
        headerWeight = '600';
        roleWeights = { ...DEFAULT_ROLE_WEIGHTS };
        foundationColors = {
            light: { ...DEFAULT_FOUNDATION_COLORS.light },
            dark: { ...DEFAULT_FOUNDATION_COLORS.dark }
        };
        advancedTokens = emptyAdvancedTokens();
        brandColors = { light: baseTheme.brand, dark: baseTheme.brand };
        surfaceShadows =
            baseTheme.chrome?.shadows !== false && baseTheme.chrome?.surfaceShadows !== false;
        controlShadows =
            baseTheme.chrome?.shadows !== false && baseTheme.chrome?.controlShadows !== false;
        dialogShadows =
            baseTheme.chrome?.shadows !== false && baseTheme.chrome?.dialogShadows !== false;
        travelingHighlight = baseTheme.chrome?.travelingHighlight !== false;
        primaryStroke = false;
        interactiveCursor = 'default';
        syncFontSelections(theme);
    }

    function updateBrand(value: string) {
        const next = value.toLowerCase();
        brandColors = { ...brandColors, [appMode]: next };
        theme = { ...theme, brand: brandColors.light };
    }

    function updateFoundationColor(key: keyof FoundationPalette, value: string) {
        foundationColors = {
            ...foundationColors,
            [appMode]: {
                ...foundationColors[appMode],
                [key]: value.toLowerCase()
            }
        };
    }

    function updateRoleWeight(key: keyof RoleWeights, value: FontWeight) {
        roleWeights = { ...roleWeights, [key]: value };
    }

    function openMoreOptions(tab: AdvancedTab) {
        advancedTab = tab;
        moreOptionsOpen = true;
    }

    function updateAdvancedColorToken(name: ColorTokenName, value: string) {
        advancedTokens = {
            ...advancedTokens,
            colors: {
                ...advancedTokens.colors,
                [appMode]: {
                    ...advancedTokens.colors[appMode],
                    [name]: value
                }
            }
        };
    }

    function updateAdvancedSpacingToken(name: SpacingTokenName, value: string) {
        advancedTokens = {
            ...advancedTokens,
            spacing: { ...advancedTokens.spacing, [name]: value }
        };
    }

    function updateAdvancedAnimationToken(name: AnimationTokenName, value: string) {
        advancedTokens = {
            ...advancedTokens,
            animation: { ...advancedTokens.animation, [name]: value }
        };
    }

    function colorTokenFallback(definition: ColorTokenDefinition) {
        if (appMode === 'dark' && 'darkFallback' in definition && definition.darkFallback) {
            return definition.darkFallback;
        }

        return definition.fallback;
    }

    function readCssVar(name: string) {
        if (typeof document === 'undefined') {
            return '';
        }

        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function resolveTokenRaw(name: string) {
        const colorOverride = advancedTokens.colors[appMode][name as ColorTokenName];
        if (colorOverride?.trim()) {
            return colorOverride.trim();
        }

        const spacingOverride = advancedTokens.spacing[name as SpacingTokenName];
        if (spacingOverride?.trim()) {
            return spacingOverride.trim();
        }

        const animationOverride = advancedTokens.animation[name as AnimationTokenName];
        if (animationOverride?.trim()) {
            return animationOverride.trim();
        }

        const computed = readCssVar(name);
        if (computed) {
            return computed;
        }

        const colorDefinition = colorTokenDefinitions.find((item) => item.name === name);
        if (colorDefinition) {
            return colorTokenFallback(colorDefinition);
        }

        const spacingDefinition = spacingTokenDefinitions.find((item) => item.name === name);
        if (spacingDefinition) {
            return spacingDefinition.fallback;
        }

        const animationDefinition = animationTokenDefinitions.find((item) => item.name === name);
        if (animationDefinition) {
            return animationDefinition.fallback;
        }

        return '';
    }

    function resolveColorToken(definition: ColorTokenDefinition) {
        const domReady = (appliedDark ? 'dark' : 'light') === appMode;
        const override = advancedTokens.colors[appMode][definition.name]?.trim() ?? '';
        const computed = domReady ? readCssVar(definition.name) : '';
        const raw = override || computed || colorTokenFallback(definition);
        const parsed = parseCssColor(raw, resolveTokenRaw);
        if (parsed) {
            return parsed;
        }

        return {
            hex: '#000000',
            alpha: 1
        };
    }

    function resolveSpacingToken(definition: SpacingTokenDefinition) {
        const override = advancedTokens.spacing[definition.name]?.trim() ?? '';
        const raw = override || readCssVar(definition.name) || definition.fallback;
        return parsePxLength(raw, resolveTokenRaw);
    }

    function resolveAnimationRaw(definition: AnimationTokenDefinition) {
        const override = advancedTokens.animation[definition.name]?.trim() ?? '';
        return override || readCssVar(definition.name) || definition.fallback;
    }

    function animationSliderValue(definition: AnimationTokenDefinition) {
        const raw = resolveAnimationRaw(definition);
        if (definition.kind === 'duration') {
            return parseDurationMs(raw);
        }

        if (definition.kind === 'scale') {
            return parseScale(raw);
        }

        return parsePxLength(raw, resolveTokenRaw);
    }

    function animationSliderDisplay(definition: AnimationTokenDefinition, value: number) {
        if (definition.kind === 'duration') {
            return formatMs(value);
        }

        if (definition.kind === 'scale') {
            return formatScale(value);
        }

        return formatPx(value);
    }

    function commitAnimationSlider(definition: AnimationTokenDefinition, value: number) {
        if (definition.kind === 'duration') {
            updateAdvancedAnimationToken(definition.name, formatMs(value));
            return;
        }

        if (definition.kind === 'scale') {
            updateAdvancedAnimationToken(definition.name, formatScale(value));
            return;
        }

        updateAdvancedAnimationToken(definition.name, formatPx(value));
    }

    function animationEaseValue(definition: AnimationTokenDefinition) {
        return matchingEase(resolveAnimationRaw(definition));
    }

    function headerSliderProps(): SliderProps {
        return {
            value: headerSize,
            min: 16,
            max: 48,
            step: 1,
            label: 'Header size',
            class: 'h-4',
            onValueChange: (value) => {
                headerSize = value;
            }
        };
    }

    function progressProps(value: number, destructive = false): ProgressProps {
        return {
            value,
            class: destructive ? '[&>div]:bg-[var(--color-error)]' : ''
        };
    }

    function confirmPresetChange() {
        if (!pendingPreset) return;
        previousPreset = pendingPreset;
        selectedPreset = pendingPreset;
        applyPreset(pendingPreset);
        pendingPreset = null;
    }

    function runDashboardAction(
        title: string,
        description: string,
        type: 'success' | 'error' = 'success'
    ) {
        toast({ title, description, type, duration: 1800 });
    }

    function invoiceBadgeVariant(status: InvoiceStatus) {
        if (status === 'Paid') {
            return 'success';
        }
        if (status === 'Overdue') {
            return 'error';
        }
        if (status === 'Due soon') {
            return 'warning';
        }
        return 'secondary';
    }

    function toggleSelectAll(next: boolean) {
        for (const invoice of pagedInvoices) {
            selectedInvoices[invoice.reference] = next;
        }
    }

    function markInvoicePaid(reference: string) {
        invoices = invoices.map((invoice) =>
            invoice.reference === reference ? { ...invoice, status: 'Paid' } : invoice
        );
        runDashboardAction('Payment recorded', `${reference} is marked paid.`);
    }

    function createInvoice() {
        const client = newInvoiceCustomer.trim();
        if (client === '') {
            runDashboardAction(
                'Customer is required',
                'Add a customer name to draft the invoice.',
                'error'
            );
            invoiceModalOpen = true;
            return;
        }

        const nextNumber = 2300 + invoices.length;
        const reference = `INV-${nextNumber}`;
        const initials = client
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        invoices = [
            {
                client,
                initials,
                reference,
                due: 'Sep 30',
                amount: '$0',
                status: 'Draft'
            },
            ...invoices
        ];
        selectedInvoices[reference] = false;
        newInvoiceCustomer = '';
        newInvoiceNotes = '';
        invoiceModalOpen = false;
        studioView = 'invoices';
        invoicePage = 1;
        runDashboardAction('Invoice drafted', `${reference} is in the queue.`);
    }

    function markNotificationRead(id: string) {
        notifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        );
    }

    $effect(() => {
        invoiceQuery;
        invoiceStatus;
        invoicePage = 1;
    });

    $effect(() => {
        if (invoicePage > invoicePageCount) {
            invoicePage = invoicePageCount;
        }
    });

    onMount(() => {
        const storedTheme = loadStudioTheme();
        if (storedTheme) {
            theme = { ...storedTheme };
            syncFontSelections(theme);
        }
        loadStudioExtensions();
        previousRadius = theme.radius;
        previousDensity = theme.density;
        hydrated = true;
        const root = document.documentElement;
        appliedDark = root.classList.contains('dark');
        const observer = new MutationObserver(() => {
            appliedDark = root.classList.contains('dark');
        });
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    });

    $effect(() => {
        if (selectedPreset === previousPreset) return;
        const nextPreset = selectedPreset;
        if (dirty) {
            pendingPreset = nextPreset;
            selectedPreset = previousPreset;
            presetDialogOpen = true;
            return;
        }
        previousPreset = nextPreset;
        applyPreset(nextPreset);
    });

    $effect(() => {
        if (!hydrated) {
            previousRadius = theme.radius;
            previousDensity = theme.density;
            return;
        }
        const radiusChanged = theme.radius !== previousRadius;
        const densityChanged = theme.density !== previousDensity;
        if (!radiusChanged && !densityChanged) {
            return;
        }
        previousRadius = theme.radius;
        previousDensity = theme.density;
        const nextSpacing = { ...advancedTokens.spacing };
        let changed = false;
        if (radiusChanged) {
            for (const name of radiusTokenNames) {
                if (nextSpacing[name]?.trim()) {
                    delete nextSpacing[name];
                    changed = true;
                }
            }
        }
        if (densityChanged && nextSpacing['--sivir-space-unit']?.trim()) {
            delete nextSpacing['--sivir-space-unit'];
            changed = true;
        }
        if (changed) {
            advancedTokens = { ...advancedTokens, spacing: nextSpacing };
        }
    });

    $effect(() => {
        if (selectedSans === previousSans) return;
        previousSans = selectedSans;
        const selected = sansFonts.find((font) => font.key === selectedSans);
        if (selected) theme = { ...theme, fontSans: selected.value };
    });

    $effect(() => {
        if (selectedHeader === previousHeader) return;
        previousHeader = selectedHeader;
        const selected = headerFonts.find((font) => font.key === selectedHeader);
        if (selected) theme = { ...theme, fontHeader: selected.value };
    });

    $effect(() => {
        if (selectedMono === previousMono) return;
        previousMono = selectedMono;
        const selected = monoFonts.find((font) => font.key === selectedMono);
        if (selected) theme = { ...theme, fontMono: selected.value };
    });

    $effect(() => {
        if (!hydrated) return;
        const css = generatedCss;
        document.documentElement.style.removeProperty('--font-sans');
        applyLiveThemeCss(css);
        saveStudioTheme({ ...theme });
        saveStudioExtensions();
    });
</script>

<svelte:head>
    <title>Sivir · Theme Studio</title>
    <meta name="description" content="Build, preview, and export a Sivir theme." />
</svelte:head>

{#snippet moreOptionsButton(tab: AdvancedTab, label: string)}
    <Button
        variant="ghost"
        size="icon"
        class="size-7 shrink-0 text-foreground-muted"
        onclick={() => openMoreOptions(tab)}
        aria-label={label}
    >
        <MoreHorizontal size={15} />
    </Button>
{/snippet}

{#snippet segmentedChoice(
    values: readonly string[],
    value: string,
    label: string,
    onChange: (value: string) => void
)}
    {@const selection = valueBinding(value, onChange)}
    <div role="group" aria-label={label}>
        <Tabs.Root bind:value={selection.value} variant="ghost" class="w-full">
            <Tabs.List
                class={`grid w-full ${values.length === 2 ? 'grid-cols-2' : values.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}
            >
                {#each values as option (option)}
                    <Tabs.Trigger value={option} class="w-full">
                        {formatChoice(option)}
                    </Tabs.Trigger>
                {/each}
            </Tabs.List>
        </Tabs.Root>
    </div>
{/snippet}

{#snippet weightControl(
    label: string,
    value: FontWeight,
    onChange: (value: FontWeight) => void
)}
    {@const selection = valueBinding(value, onChange)}
    <div class="flex items-center gap-2" role="group" aria-label={`${label} weight`}>
        <span class="w-[76px] shrink-0 text-[13px] font-medium text-foreground-muted">{label}</span>
        <Tabs.Root bind:value={selection.value} variant="ghost" class="min-w-0 flex-1">
            <Tabs.List class="grid w-full grid-cols-4">
                {#each fontWeights as weight (weight)}
                    <Tabs.Trigger value={weight} class="min-h-7 w-full px-1 py-0 text-xs"
                        >{weight}</Tabs.Trigger
                    >
                {/each}
            </Tabs.List>
        </Tabs.Root>
    </div>
{/snippet}

{#snippet colorPickerControl(
    label: string,
    value: string,
    options: { label: string; value: string }[],
    onChange: (value: string) => void
)}
    <div class="flex min-w-0 flex-col gap-2" role="group" aria-label={`${label} color`}>
        <span class="text-[13px] font-medium text-foreground-muted">{label}</span>
        <ColorPicker.Root {value} onValueChange={onChange} {options}>
            <ColorPicker.Trigger class="h-[34px] w-full" />
            <ColorPicker.Content />
        </ColorPicker.Root>
    </div>
{/snippet}

{#snippet advancedColorField(label: string, value: string, onChange: (value: string) => void)}
    <div class="flex min-w-0 flex-col gap-2" role="group" aria-label={`${label} color`}>
        <span class="text-[13px] font-medium text-foreground-muted">{label}</span>
        <ColorPicker.Root {value} onValueChange={onChange}>
            <ColorPicker.Trigger class="h-[34px] w-full" />
            <ColorPicker.Content />
        </ColorPicker.Root>
    </div>
{/snippet}

{#snippet sliderTokenField(
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    display: string,
    onChange: (value: number) => void
)}
    <div class="flex min-w-0 flex-col gap-2">
        <div class="flex items-baseline justify-between gap-2">
            <span class="text-[13px] font-medium text-foreground-muted">{label}</span>
            <span class="font-mono text-xs tabular-nums text-foreground-muted">{display}</span>
        </div>
        <Slider {value} {min} {max} {step} {label} class="h-4" onValueChange={onChange} />
    </div>
{/snippet}

{#snippet easeTokenField(label: string, value: string, onChange: (value: string) => void)}
    <div class="flex min-w-0 flex-col gap-2">
        <span class="text-[13px] font-medium text-foreground-muted">{label}</span>
        <Select.Root {value} onValueChange={onChange}>
            <Select.Trigger
                class="h-[34px] min-w-0 px-[9px] text-[13px]"
                variant="outline"
                aria-label={label}
            >
                <span class="truncate">
                    {easingOptions.find((option) => option.value === value)?.label ?? 'Custom'}
                </span>
            </Select.Trigger>
            <Select.Content class="min-w-[max(16rem,var(--popover-trigger-width))]">
                {#each easingOptions as option (option.value)}
                    <Select.Item value={option.value} label={option.label}>
                        {option.label}
                    </Select.Item>
                {/each}
                {#if !easingOptions.some((option) => normalizeEase(option.value) === normalizeEase(value))}
                    <Select.Item {value} label="Custom">Custom</Select.Item>
                {/if}
            </Select.Content>
        </Select.Root>
    </div>
{/snippet}

{#snippet inspector()}
    <ScrollArea class="hide-scrollbar-all h-full min-h-0 flex-1 bg-background" showCues={false}>
        <div class="flex min-h-full flex-col gap-8 px-2 py-4">
            <div class="flex shrink-0 flex-col gap-3">
                <div class="grid grid-cols-2 gap-2">
                    <CopyButton
                        text={generatedJson}
                        label="Copy JSON"
                        variant="outline"
                        size="md"
                        class="w-full"
                        oncopy={() => {
                            copiedKey = 'json';
                            toast({
                                title: 'JSON copied',
                                description: 'The draft is ready to paste into your project.',
                                type: 'success',
                                duration: 1600
                            });
                            window.setTimeout(() => {
                                if (copiedKey === 'json') {
                                    copiedKey = null;
                                }
                            }, 1200);
                        }}
                    >
                        {copiedKey === 'json' ? 'Copied' : 'Copy JSON'}
                    </CopyButton>
                    <CopyButton
                        text={generatedCss}
                        label="Copy CSS"
                        variant="outline"
                        size="md"
                        class="w-full"
                        oncopy={() => {
                            copiedKey = 'css';
                            toast({
                                title: 'CSS copied',
                                description: 'The draft is ready to paste into your project.',
                                type: 'success',
                                duration: 1600
                            });
                            window.setTimeout(() => {
                                if (copiedKey === 'css') {
                                    copiedKey = null;
                                }
                            }, 1200);
                        }}
                    >
                        {copiedKey === 'css' ? 'Copied' : 'Copy CSS'}
                    </CopyButton>
                </div>
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <Select.Root bind:value={selectedPreset}>
                    <Select.Trigger
                        class="h-9 min-w-0 flex-1 px-3 text-sm"
                        variant="outline"
                        aria-label="Theme starting point"
                    >
                        <span class="truncate">
                            {builtInThemePresets.find((preset) => preset.slug === selectedPreset)
                                ?.name ?? 'Default'}
                            · Sivir UI
                        </span>
                    </Select.Trigger>
                    <Select.Content
                        class="max-h-56 min-w-[max(16rem,var(--popover-trigger-width))]"
                    >
                        {#each builtInThemePresets as preset (preset.slug)}
                            <Select.Item value={preset.slug} label={preset.name}>
                                {preset.name}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
                <Button
                    variant="outline"
                    size="icon"
                    class="size-9 shrink-0"
                    onclick={resetTheme}
                    aria-label="Reset theme to selected preset"
                >
                    <RotateCcw size={15} />
                </Button>
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between gap-2">
                    <Typography.Title level={3}>Color</Typography.Title>
                    {@render moreOptionsButton('colors', 'More color options')}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    {@render colorPickerControl(
                        'Brand',
                        brandColors[appMode],
                        brandSwatches,
                        updateBrand
                    )}
                    {@render colorPickerControl(
                        'On brand',
                        foundationColors[appMode].onPrimary,
                        onPrimarySwatches,
                        (value) => {
                            updateFoundationColor('onPrimary', value);
                        }
                    )}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    {@render colorPickerControl(
                        'Base',
                        foundationColors[appMode].base,
                        baseSwatches,
                        (value) => {
                            updateFoundationColor('base', value);
                        }
                    )}
                    {@render colorPickerControl(
                        'Border',
                        foundationColors[appMode].border,
                        borderSwatches,
                        (value) => {
                            updateFoundationColor('border', value);
                        }
                    )}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    {@render colorPickerControl(
                        'Background',
                        foundationColors[appMode].background,
                        backgroundSwatches,
                        (value) => {
                            updateFoundationColor('background', value);
                        }
                    )}
                    {@render colorPickerControl(
                        'Secondary',
                        foundationColors[appMode].secondary,
                        secondarySwatches,
                        (value) => {
                            updateFoundationColor('secondary', value);
                        }
                    )}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    {@render colorPickerControl(
                        'Muted text',
                        foundationColors[appMode].foregroundMuted,
                        foregroundSwatches,
                        (value) => {
                            updateFoundationColor('foregroundMuted', value);
                        }
                    )}
                    {@render colorPickerControl(
                        'Foreground',
                        foundationColors[appMode].foreground,
                        foregroundSwatches,
                        (value) => {
                            updateFoundationColor('foreground', value);
                        }
                    )}
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between gap-2">
                    <Typography.Title level={3}>Shape & density</Typography.Title>
                    {@render moreOptionsButton('spacing', 'More shape and density options')}
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-baseline justify-between gap-2">
                        <Typography.Metadata>Radius</Typography.Metadata>
                        <Typography.Metadata>{radiusValues[theme.radius]}</Typography.Metadata>
                    </div>
                    {@render segmentedChoice(radiusScales, theme.radius, 'Radius scale', (value) => {
                        if (radiusScales.includes(value as Theme['radius'])) {
                            theme = { ...theme, radius: value as Theme['radius'] };
                        }
                    })}
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-baseline justify-between gap-2">
                        <Typography.Metadata>Density</Typography.Metadata>
                        <Typography.Metadata>{densityValues[theme.density]}</Typography.Metadata>
                    </div>
                    {@render segmentedChoice(
                        densities,
                        theme.density,
                        'Interface density',
                        (value) => {
                            if (densities.includes(value as Theme['density'])) {
                                theme = { ...theme, density: value as Theme['density'] };
                            }
                        }
                    )}
                </div>
                <Switch
                    bind:checked={surfaceShadows}
                    label="Card & menu shadows"
                    description="Lift on cards, selects, dropdowns, and popovers."
                />
                <Switch
                    bind:checked={controlShadows}
                    label="Control shadows"
                    description="Depth on inputs, buttons, and alerts."
                />
                <Switch
                    bind:checked={dialogShadows}
                    label="Dialog shadows"
                    description="Lift on modals and sheets."
                />
                <Switch
                    bind:checked={travelingHighlight}
                    label="Traveling highlight"
                    description="Slide the hover highlight between items. Off keeps the fill without the motion."
                />
                <Switch
                    bind:checked={primaryStroke}
                    label="Primary stroke"
                    description="A light inset edge on primary buttons."
                />
                <div class="flex flex-col gap-2">
                    <Typography.Metadata>Hover cursor</Typography.Metadata>
                    {@render segmentedChoice(
                        cursorChoices,
                        interactiveCursor,
                        'Hover cursor',
                        (value) => {
                            if (value === 'default' || value === 'pointer') {
                                interactiveCursor = value;
                            }
                        }
                    )}
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <Typography.Title level={3}>Typography</Typography.Title>
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex min-w-0 flex-col gap-2">
                        <Typography.Metadata>Sans</Typography.Metadata>
                        <Select.Root bind:value={selectedSans}>
                            <Select.Trigger
                                class="h-[34px] min-w-0 px-[9px] text-[13px]"
                                variant="outline"
                                aria-label="Sans font"
                            >
                                <span class="truncate">
                                    {sansFonts.find((font) => font.key === selectedSans)?.label}
                                </span>
                            </Select.Trigger>
                            <Select.Content
                                class="max-h-56 min-w-[max(16rem,var(--popover-trigger-width))]"
                            >
                                <Select.Label>Sans serif</Select.Label>
                                {#each sansFonts as font (font.key)}
                                    <Select.Item value={font.key} label={font.label}
                                        >{font.label}</Select.Item
                                    >
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>
                    <div class="flex min-w-0 flex-col gap-2">
                        <Typography.Metadata>Header</Typography.Metadata>
                        <Select.Root bind:value={selectedHeader}>
                            <Select.Trigger
                                class="h-[34px] min-w-0 px-[9px] text-[13px]"
                                variant="outline"
                                aria-label="Header font"
                            >
                                <span
                                    class="truncate"
                                    style:font-family={headerFonts.find(
                                            (font) => font.key === selectedHeader
                                        )?.value}
                                >
                                    {headerFonts.find((font) => font.key === selectedHeader)?.label}
                                </span>
                            </Select.Trigger>
                            <Select.Content
                                class="max-h-56 min-w-[max(16rem,var(--popover-trigger-width))]"
                            >
                                <Select.Item value="same-as-sans" label="Same as sans">
                                    <span style:font-family="var(--font-sans)">Same as sans</span>
                                </Select.Item>
                                <Select.Label>Serif</Select.Label>
                                {#each serifFonts as font (font.key)}
                                    <Select.Item value={font.key} label={font.label}>
                                        <span style:font-family={font.value}>{font.label}</span>
                                    </Select.Item>
                                {/each}
                                <Select.Label>Sans serif</Select.Label>
                                {#each sansFonts as font (font.key)}
                                    <Select.Item value={font.key} label={font.label}>
                                        <span style:font-family={font.value}>{font.label}</span>
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>
                </div>
                <div class="flex min-w-0 flex-col gap-2">
                    <Typography.Metadata>Mono</Typography.Metadata>
                    <Select.Root bind:value={selectedMono}>
                        <Select.Trigger
                            class="h-[34px] min-w-0 px-[9px] font-mono text-[13px]"
                            variant="outline"
                            aria-label="Monospace font"
                        >
                            <span class="truncate">
                                {monoFonts.find((font) => font.key === selectedMono)?.label}
                            </span>
                        </Select.Trigger>
                        <Select.Content
                            class="h-56 min-w-[max(16rem,var(--popover-trigger-width))]"
                        >
                            <Select.Label>Mono</Select.Label>
                            {#each monoFonts as font (font.key)}
                                <Select.Item value={font.key} label={font.label}
                                    >{font.label}</Select.Item
                                >
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-baseline justify-between gap-2">
                        <Typography.Metadata>Header size</Typography.Metadata>
                        <Typography.Metadata>{headerSize}px</Typography.Metadata>
                    </div>
                    <Slider {...headerSliderProps()} />
                </div>
                <div class="flex flex-col gap-2.5">
                    <Typography.Metadata>Font weights</Typography.Metadata>
                    {@render weightControl('Header', headerWeight, (value) => {
                            headerWeight = value;
                        })}
                    {@render weightControl('Body', roleWeights.body, (value) => {
                            updateRoleWeight('body', value);
                        })}
                    {@render weightControl('Label', roleWeights.label, (value) => {
                            updateRoleWeight('label', value);
                        })}
                    {@render weightControl('Button', roleWeights.button, (value) => {
                            updateRoleWeight('button', value);
                        })}
                    {@render weightControl('Badge', roleWeights.badge, (value) => {
                            updateRoleWeight('badge', value);
                        })}
                    {@render weightControl('Description', roleWeights.description, (value) => {
                            updateRoleWeight('description', value);
                        })}
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between gap-2">
                    <Typography.Title level={3}>Motion</Typography.Title>
                    {@render moreOptionsButton('animation', 'More motion options')}
                </div>
                {@render segmentedChoice(motionFeels, theme.motion, 'Motion feel', (value) => {
                    if (motionFeels.includes(value as Theme['motion'])) {
                        theme = { ...theme, motion: value as Theme['motion'] };
                    }
                })}
            </div>
        </div>
    </ScrollArea>
{/snippet}

{#snippet dashboardPreview()}
    <ScrollArea class="h-full min-h-0" showCues={false}>
        <div class="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
            <Toolbar class="gap-2 p-0">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger variant="quiet" class="min-w-0 justify-start px-0">
                        <Avatar.Root size="sm" shape="square">
                            <Avatar.Fallback>NL</Avatar.Fallback>
                        </Avatar.Root>
                        <Typography.Text variant="supporting" class="truncate text-foreground">
                            {companyName}
                        </Typography.Text>
                        <ChevronDown size={14} class="text-foreground-muted" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Workspace</DropdownMenu.Label>
                        <DropdownMenu.Item>Northstar Ledger</DropdownMenu.Item>
                        <DropdownMenu.Item>Personal books</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                            callback={() =>
                                runDashboardAction(
                                    'Workspace created',
                                    'A blank ledger is ready.'
                                )}
                        >
                            Create workspace
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <div class="ml-auto flex items-center gap-1">
                    <Popover.Root placement="bottom-end" inert={false}>
                        <Popover.Trigger
                            variant="ghost"
                            size="icon"
                            class="relative"
                            aria-label="Notifications"
                        >
                            <Bell size={16} />
                            {#if unreadNotificationCount > 0}
                                <Badge
                                    variant="error"
                                    class="pointer-events-none absolute top-0.5 right-0.5 size-3.5 min-w-3.5 bg-[var(--color-error)] p-0 text-[length:var(--font-size-meta)] text-[var(--color-on-primary)] leading-none"
                                >
                                    {unreadNotificationCount}
                                </Badge>
                            {/if}
                        </Popover.Trigger>
                        <Popover.Content class="w-80" surfaceClass="p-2" lockScroll={false}>
                            <div class="flex items-center justify-between px-2 pt-1 pb-1.5">
                                <Popover.Title
                                    class="text-[length:var(--font-size-body)] leading-snug"
                                >
                                    Notifications
                                </Popover.Title>
                                {#if unreadNotificationCount > 0}
                                    <Typography.Metadata class="tabular-nums">
                                        {unreadNotificationCount}
                                        new
                                    </Typography.Metadata>
                                {/if}
                            </div>
                            <div class="flex flex-col gap-0.5">
                                {#each notifications as notification (notification.id)}
                                    <Button
                                        unstyled
                                        class="flex w-full items-start justify-start gap-3 rounded-[var(--radius-md)] px-2 py-2 text-left select-none transition-[background-color,border-color,color] [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] hover:bg-foreground/[0.08] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                                        onclick={() => markNotificationRead(notification.id)}
                                    >
                                        <span
                                            class="flex min-w-0 flex-1 flex-col items-start gap-0.5"
                                        >
                                            <span
                                                class="w-full text-left text-[length:var(--font-size-body)] leading-snug text-pretty text-foreground {notification.read
                                                    ? 'font-normal'
                                                    : 'font-medium'}"
                                            >
                                                {notification.title}
                                            </span>
                                            <Typography.Metadata class="tabular-nums">
                                                {notification.detail}
                                            </Typography.Metadata>
                                        </span>
                                        {#if !notification.read}
                                            <Badge
                                                variant="secondary"
                                                class="mt-0.5 shrink-0 self-start"
                                            >
                                                New
                                            </Badge>
                                        {/if}
                                    </Button>
                                {/each}
                            </div>
                        </Popover.Content>
                    </Popover.Root>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                            variant="quiet"
                            size="icon"
                            aria-label="Open profile menu"
                        >
                            <Avatar.Root size="sm">
                                <Avatar.Fallback>AN</Avatar.Fallback>
                            </Avatar.Root>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content class="min-w-[16rem]">
                            <DropdownMenu.Label>
                                <span class="text-[0.7rem] text-foreground-muted">
                                    avery@northstar.dev
                                </span>
                            </DropdownMenu.Label>
                            <DropdownMenu.Item callback={() => (studioView = 'settings')}>
                                <span class="flex items-center gap-2">
                                    <User size={13} />
                                    Profile
                                </span>
                                <Shortcut shortcut="shift+cmd+P" />
                            </DropdownMenu.Item>
                            <DropdownMenu.Item callback={() => (studioView = 'settings')}>
                                <span class="flex items-center gap-2">
                                    <Settings size={13} />
                                    Preferences
                                </span>
                                <Shortcut shortcut="cmd+," />
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                callback={() =>
                                    runDashboardAction(
                                        'Billing opened',
                                        'The billing portal is on its way.'
                                    )}
                            >
                                <span class="flex items-center gap-2">
                                    <CreditCard size={13} />
                                    Billing
                                </span>
                                <Shortcut shortcut="cmd+B" />
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                                callback={() =>
                                    runDashboardAction(
                                        'Support pinged',
                                        'We will follow up shortly.'
                                    )}
                            >
                                <span class="flex items-center gap-2">
                                    <LifeBuoy size={13} />
                                    Help & feedback
                                </span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                callback={() =>
                                    runDashboardAction('Signed out', 'The session ended.')}
                            >
                                <span class="flex items-center gap-2 text-[var(--color-error)]">
                                    <LogOut size={13} />
                                    Sign out
                                </span>
                                <Shortcut shortcut="shift+cmd+Q" />
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            </Toolbar>

            <Tabs.Root bind:value={studioView} variant="segmented">
                <div class="flex flex-wrap items-center gap-2">
                    <Tabs.List>
                        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                        <Tabs.Trigger value="invoices">Invoices</Tabs.Trigger>
                        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                    </Tabs.List>
                    <Command.Root bind:open={commandOpen}>
                        <Command.Trigger
                            variant="outline"
                            class="ml-auto min-w-0 w-52 shrink-0 justify-between gap-2"
                        >
                            <span class="flex min-w-0 items-center gap-2">
                                <Search size={14} />
                                <span class="truncate">Search</span>
                            </span>
                            <Shortcut
                                shortcut="cmd+k"
                                class="shrink-0"
                                ontrigger={() => {
                                    commandOpen = true;
                                }}
                            />
                        </Command.Trigger>
                        <Command.Content>
                            <Command.Search placeholder="Search ledger…" />
                            <Command.Results>
                                <Command.Group heading="Go to">
                                    <Command.Item
                                        name="Overview"
                                        callback={() => {
                                            studioView = 'overview';
                                        }}
                                    >
                                        <LayoutDashboard size={14} />
                                        Overview
                                    </Command.Item>
                                    <Command.Item
                                        name="Invoices"
                                        callback={() => {
                                            studioView = 'invoices';
                                        }}
                                    >
                                        <FileText size={14} />
                                        Invoices
                                    </Command.Item>
                                    <Command.Item
                                        name="Settings"
                                        callback={() => {
                                            studioView = 'settings';
                                        }}
                                    >
                                        <Settings size={14} />
                                        Settings
                                    </Command.Item>
                                </Command.Group>
                                <Command.Separator />
                                <Command.Group heading="Actions">
                                    <Command.Item
                                        name="New invoice"
                                        callback={() => {
                                            studioView = 'invoices';
                                            invoiceModalOpen = true;
                                        }}
                                    >
                                        <Plus size={14} />
                                        New invoice
                                    </Command.Item>
                                </Command.Group>
                                <Command.Group heading="Invoices">
                                    {#each invoices as invoice (invoice.reference)}
                                        <Command.Item
                                            name={`${invoice.client} ${invoice.reference}`}
                                            callback={() => {
                                                studioView = 'invoices';
                                                invoiceQuery = invoice.reference;
                                            }}
                                        >
                                            {invoice.client}
                                            <Typography.Metadata>
                                                {invoice.reference}
                                            </Typography.Metadata>
                                        </Command.Item>
                                    {/each}
                                </Command.Group>
                            </Command.Results>
                        </Command.Content>
                    </Command.Root>
                </div>

                <Tabs.Content value="overview" class="flex flex-col gap-6 pt-6">
                    <div>
                        <Typography.Title level={1}>Overview</Typography.Title>
                        <Typography.Description>
                            Cash on hand and collection risk for {companyName}.
                        </Typography.Description>
                    </div>
                    <Tabs.Root bind:value={dashboardRange} variant="ghost">
                        <Tabs.List class="w-fit">
                            <Tabs.Trigger value="7d">7 days</Tabs.Trigger>
                            <Tabs.Trigger value="30d">30 days</Tabs.Trigger>
                            <Tabs.Trigger value="Quarter">Quarter</Tabs.Trigger>
                        </Tabs.List>
                    </Tabs.Root>
                    {#if overdueCount > 0}
                        <Alert.Root variant="warning">
                            <Alert.Title>
                                {overdueCount}
                                {overdueCount === 1 ? 'invoice is' : 'invoices are'}
                                overdue
                            </Alert.Title>
                            <Alert.Description>
                                ${outstandingTotal.toLocaleString('en-US')}
                                is still open. The next collection run starts tomorrow at 9:00 AM.
                            </Alert.Description>
                        </Alert.Root>
                    {/if}
                    <Card.Root>
                        <Card.Header>
                            <Typography.Title level={2}>Cash coverage</Typography.Title>
                            <Typography.Description>
                                Funds available for the selected range.
                            </Typography.Description>
                        </Card.Header>
                        <Card.Content class="flex flex-col gap-4">
                            <Gauge
                                value={coverageValue}
                                label="Cash coverage"
                                tone="success"
                                size={72}
                            >
                                {coverageValue}%
                            </Gauge>
                            <Progress {...progressProps(coverageValue)} />
                            <Switch
                                bind:checked={autoReconcile}
                                label="Auto-reconcile"
                                description="Match confirmed bank payments as they arrive."
                            />
                            <TaskSteps
                                label="Collection run"
                                steps={collectionSteps}
                                current={collectionStep}
                            />
                        </Card.Content>
                    </Card.Root>
                </Tabs.Content>

                <Tabs.Content value="invoices" class="flex flex-col gap-6 pt-6">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Typography.Title level={1}>Invoices</Typography.Title>
                            <Typography.Description>
                                Review, remind, and record payment.
                            </Typography.Description>
                        </div>
                        <Modal.Root bind:open={invoiceModalOpen}>
                            <Modal.Trigger>
                                <Plus size={15} />
                                New invoice
                            </Modal.Trigger>
                            <Modal.Content>
                                <Modal.Header>
                                    <Modal.Title>New invoice</Modal.Title>
                                    <Modal.Description>
                                        Draft a customer invoice. You can add line items later.
                                    </Modal.Description>
                                </Modal.Header>
                                <Modal.Body class="gap-4">
                                    <Input
                                        bind:value={newInvoiceCustomer}
                                        label="Customer"
                                        placeholder="Studio name"
                                    />
                                    <Textarea
                                        bind:value={newInvoiceNotes}
                                        label="Notes"
                                        placeholder="Optional context for the draft"
                                        autoresize
                                    />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Modal.Close>
                                        Cancel
                                        <Shortcut shortcut="esc" />
                                    </Modal.Close>
                                    <Modal.Confirm onclick={createInvoice}>
                                        Create draft
                                        <Shortcut shortcut="enter" />
                                    </Modal.Confirm>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal.Root>
                    </div>
                    <Toolbar class="gap-2 p-0">
                        <Combobox.Root bind:value={invoiceQuery}>
                            <Combobox.Trigger
                                appearance="input"
                                placeholder="Search customer"
                                class="min-w-0 flex-1"
                            >
                                {#snippet trailing()}
                                    <Search size={16} />
                                {/snippet}
                            </Combobox.Trigger>
                            <Combobox.Content>
                                <Combobox.Results>
                                    {#each customers as customer (customer)}
                                        <Combobox.Item value={customer} label={customer} />
                                    {/each}
                                </Combobox.Results>
                            </Combobox.Content>
                        </Combobox.Root>
                        <Select.Root bind:value={invoiceStatus}>
                            <Select.Trigger variant="outline" aria-label="Invoice status">
                                {invoiceStatus === 'all'
                                    ? 'All statuses'
                                    : invoiceStatus === 'open'
                                      ? 'Open'
                                      : formatChoice(invoiceStatus)}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="all" label="All statuses">
                                    All statuses
                                </Select.Item>
                                <Select.Item value="open" label="Open">Open</Select.Item>
                                <Select.Item value="paid" label="Paid">Paid</Select.Item>
                                <Select.Item value="overdue" label="Overdue">Overdue</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </Toolbar>
                    {#if pagedInvoices.length > 0}
                        <Checkbox
                            checked={allVisibleSelected}
                            label="Select visible invoices"
                            onCheckedChange={toggleSelectAll}
                        />
                    {/if}
                    {#each pagedInvoices as invoice (invoice.reference)}
                        <ContextMenu.Root>
                            <ContextMenu.Trigger class="block">
                                <div
                                    class="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                                >
                                    <Checkbox
                                        bind:checked={selectedInvoices[invoice.reference]}
                                        label={invoice.client}
                                        description={`${invoice.reference} · due ${invoice.due}`}
                                        class="min-w-0 flex-1"
                                    />
                                    <Tooltip.Root>
                                        <Tooltip.Trigger class="ml-auto shrink-0">
                                            <Badge variant={invoiceBadgeVariant(invoice.status)}>
                                                {invoice.status}
                                            </Badge>
                                        </Tooltip.Trigger>
                                        <Tooltip.Content>Due {invoice.due}</Tooltip.Content>
                                    </Tooltip.Root>
                                    <Typography.Metadata
                                        class="w-16 shrink-0 text-right tabular-nums"
                                    >
                                        {invoice.amount}
                                    </Typography.Metadata>
                                    <CopyButton
                                        text={invoice.reference}
                                        label="Copy invoice number"
                                    />
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger
                                            variant="ghost"
                                            size="icon"
                                            aria-label={`Actions for ${invoice.reference}`}
                                        >
                                            <MoreHorizontal size={16} />
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item
                                                callback={() =>
                                                    runDashboardAction(
                                                        'Reminder sent',
                                                        `${invoice.client} will be notified.`
                                                    )}
                                            >
                                                Send reminder
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                callback={() => markInvoicePaid(invoice.reference)}
                                            >
                                                Record payment
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator />
                                            <DropdownMenu.Item
                                                callback={() =>
                                                    runDashboardAction(
                                                        'Invoice duplicated',
                                                        `${invoice.reference} copied as a draft.`
                                                    )}
                                            >
                                                Duplicate
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </div>
                            </ContextMenu.Trigger>
                            <ContextMenu.Content>
                                <ContextMenu.Item
                                    callback={() =>
                                        runDashboardAction(
                                            'Reminder sent',
                                            `${invoice.client} will be notified.`
                                        )}
                                >
                                    Send reminder
                                </ContextMenu.Item>
                                <ContextMenu.Item
                                    callback={() => markInvoicePaid(invoice.reference)}
                                >
                                    Record payment
                                </ContextMenu.Item>
                                <ContextMenu.Separator />
                                <ContextMenu.Item
                                    callback={() =>
                                        runDashboardAction(
                                            'Invoice duplicated',
                                            `${invoice.reference} copied as a draft.`
                                        )}
                                >
                                    Duplicate
                                </ContextMenu.Item>
                            </ContextMenu.Content>
                        </ContextMenu.Root>
                    {:else}
                        <Alert.Root variant="info">
                            <Alert.Title>No invoices found</Alert.Title>
                            <Alert.Description>
                                Change the search or status filter to see more invoices.
                            </Alert.Description>
                        </Alert.Root>
                    {/each}
                    <Toolbar class="p-0">
                        <Typography.Metadata>
                            Showing {pagedInvoices.length} of {visibleInvoices.length}
                        </Typography.Metadata>
                        <Pagination bind:page={invoicePage} total={invoicePageCount} />
                    </Toolbar>
                </Tabs.Content>

                <Tabs.Content value="settings" class="flex flex-col gap-6 pt-6">
                    <div>
                        <Typography.Title level={1}>Settings</Typography.Title>
                        <Typography.Description>
                            Collection defaults for this workspace.
                        </Typography.Description>
                    </div>
                    <Accordion.Root type="multiple" bind:value={settingsSections}>
                        <Accordion.Item value="workspace">
                            <Accordion.Trigger>Workspace</Accordion.Trigger>
                            <Accordion.Content>
                                <div class="flex flex-col gap-4">
                                    <Input bind:value={companyName} label="Workspace name" />
                                    <Switch
                                        bind:checked={autoReconcile}
                                        label="Auto-reconcile"
                                        description="Match confirmed bank payments as they arrive."
                                    />
                                </div>
                            </Accordion.Content>
                        </Accordion.Item>
                        <Accordion.Item value="reminders">
                            <Accordion.Trigger>Reminders</Accordion.Trigger>
                            <Accordion.Content>
                                <div class="flex flex-col gap-4">
                                    <RadioGroup.Root
                                        bind:value={reminderCadence}
                                        name="reminder-cadence"
                                    >
                                        <RadioGroup.Item
                                            value="off"
                                            label="Off"
                                            description="Send reminders yourself."
                                        />
                                        <RadioGroup.Item
                                            value="weekly"
                                            label="Weekly"
                                            description="Every Monday for open invoices."
                                        />
                                        <RadioGroup.Item
                                            value="due"
                                            label="Before due"
                                            description="Once, a few days before the due date."
                                        />
                                    </RadioGroup.Root>
                                    {#if reminderCadence === 'due'}
                                        <Slider
                                            value={reminderDays}
                                            min={1}
                                            max={14}
                                            step={1}
                                            label={`Remind ${reminderDays} days before due`}
                                            onValueChange={(value) => {
                                            reminderDays = value;
                                        }}
                                        />
                                    {/if}
                                </div>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    </ScrollArea>
{/snippet}

<div data-docs-page class="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground">
    <section aria-label="Theme workspace" class="flex min-h-0 flex-1 bg-background">
        <aside
            aria-label="Theme configuration"
            class="hidden min-h-0 w-[328px] shrink-0 px-4 py-3 min-[1100px]:flex min-[1100px]:flex-col"
        >
            {@render inspector()}
        </aside>

        <div class="min-w-0 flex-1 py-3 pr-3 pl-0">
            <div
                class="h-full min-h-0 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background font-[var(--font-sans)] text-foreground"
                id="theme-preview"
            >
                {@render dashboardPreview()}
            </div>
        </div>
    </section>

    <Sheet.Root>
        <Sheet.Trigger
            class="fixed bottom-5 right-5 z-30 shadow-[var(--elevation-float)] min-[1100px]:hidden"
        >
            <Palette size={15} />
            Customize
        </Sheet.Trigger>
        <Sheet.Content side="left" class="p-0 min-[1100px]:hidden">
            <Sheet.Header class="sr-only">
                <Sheet.Title>Theme configuration</Sheet.Title>
                <Sheet.Description>Configure the live Sivir theme preview.</Sheet.Description>
            </Sheet.Header>
            <div class="-my-4 min-h-0 flex-1 overflow-hidden px-6">
                {@render inspector()}
            </div>
        </Sheet.Content>
    </Sheet.Root>

    <Modal.Root bind:open={moreOptionsOpen} orientation="vertical">
        <Modal.Content
            size="xl"
            contentClass="!h-[min(44rem,calc(var(--sivir-viewport-height)-2rem))] !max-h-[min(44rem,calc(var(--sivir-viewport-height)-2rem))] !max-w-5xl"
            surfaceClass="!overflow-hidden"
        >
            <Modal.Header class="shrink-0">
                <Modal.Title>Advanced options</Modal.Title>
                <Modal.Description>
                    Fine-tune colors, spacing, and motion. Changes override the sidebar controls and
                    the selected preset.
                </Modal.Description>
            </Modal.Header>
            <Modal.Body class="min-h-0 flex-1 overflow-hidden">
                <Tabs.Root
                    bind:value={advancedTab}
                    variant="ghost"
                    class="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                    <Tabs.List class="mb-3 w-full shrink-0">
                        <Tabs.Trigger value="colors" class="flex-1">Colors</Tabs.Trigger>
                        <Tabs.Trigger value="spacing" class="flex-1">Spacing</Tabs.Trigger>
                        <Tabs.Trigger value="animation" class="flex-1">Animation</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content
                        value="colors"
                        class="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        <div class="mb-3 flex shrink-0 items-center justify-between gap-3">
                            <p class="text-sm text-foreground-muted">
                                Editing {formatChoice(appMode)} mode
                            </p>
                            <Tabs.Root bind:value={appModeBinding.value} variant="ghost">
                                <Tabs.List>
                                    <Tabs.Trigger value="light" class="min-h-7 px-2 py-0 text-xs"
                                        >Light</Tabs.Trigger
                                    >
                                    <Tabs.Trigger value="dark" class="min-h-7 px-2 py-0 text-xs"
                                        >Dark</Tabs.Trigger
                                    >
                                </Tabs.List>
                            </Tabs.Root>
                        </div>
                        <ScrollArea class="min-h-0 flex-1 pr-2">
                            <div class="flex flex-col gap-5 pb-2">
                                {#each colorTokenGroups as group (group.label)}
                                    <div class="flex flex-col gap-3">
                                        <h3 class="text-sm font-semibold tracking-[-0.015em]">
                                            {group.label}
                                        </h3>
                                        <div
                                            class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
                                        >
                                            {#each group.tokens as definition (definition.name)}
                                                {@const resolved = resolveColorToken(definition)}
                                                {@render advancedColorField(
                                                    definition.label,
                                                    resolved.hex,
                                                    (hex) => {
                                                        updateAdvancedColorToken(
                                                            definition.name,
                                                            formatCssColor(hex, resolved.alpha)
                                                        );
                                                    }
                                                )}
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </ScrollArea>
                    </Tabs.Content>

                    <Tabs.Content
                        value="spacing"
                        class="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        <ScrollArea class="min-h-0 flex-1 pr-2">
                            <div class="flex flex-col gap-5 pb-2">
                                {#each spacingTokenGroups as group (group.label)}
                                    <div class="flex flex-col gap-3">
                                        <h3 class="text-sm font-semibold tracking-[-0.015em]">
                                            {group.label}
                                        </h3>
                                        <div
                                            class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
                                        >
                                            {#each group.tokens as definition (definition.name)}
                                                {@const spacingValue =
                                                    resolveSpacingToken(definition)}
                                                {@render sliderTokenField(
                                                    definition.label,
                                                    spacingValue,
                                                    definition.min,
                                                    definition.max,
                                                    definition.step,
                                                    formatPx(spacingValue),
                                                    (value) => {
                                                        updateAdvancedSpacingToken(
                                                            definition.name,
                                                            formatPx(value)
                                                        );
                                                    }
                                                )}
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </ScrollArea>
                    </Tabs.Content>

                    <Tabs.Content
                        value="animation"
                        class="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        <ScrollArea class="min-h-0 flex-1 pr-2">
                            <div class="flex flex-col gap-5 pb-2">
                                {#each animationTokenGroups as group (group.label)}
                                    <div class="flex flex-col gap-3">
                                        <h3 class="text-sm font-semibold tracking-[-0.015em]">
                                            {group.label}
                                        </h3>
                                        <div
                                            class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
                                        >
                                            {#each group.tokens as definition (definition.name)}
                                                {#if definition.kind === 'ease'}
                                                    {@render easeTokenField(
                                                        definition.label,
                                                        animationEaseValue(definition),
                                                        (value) => {
                                                            updateAdvancedAnimationToken(
                                                                definition.name,
                                                                value
                                                            );
                                                        }
                                                    )}
                                                {:else}
                                                    {@const motionValue =
                                                        animationSliderValue(definition)}
                                                    {@render sliderTokenField(
                                                        definition.label,
                                                        motionValue,
                                                        definition.min,
                                                        definition.max,
                                                        definition.step,
                                                        animationSliderDisplay(
                                                            definition,
                                                            motionValue
                                                        ),
                                                        (value) => {
                                                            commitAnimationSlider(
                                                                definition,
                                                                value
                                                            );
                                                        }
                                                    )}
                                                {/if}
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </ScrollArea>
                    </Tabs.Content>
                </Tabs.Root>
            </Modal.Body>
            <Modal.Footer class="shrink-0">
                <Modal.Close>
                    Cancel
                    <Shortcut shortcut="esc" />
                </Modal.Close>
                <Modal.Confirm>
                    Done
                    <Shortcut shortcut="enter" />
                </Modal.Confirm>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Root>

    <AlertDialog.Root bind:open={presetDialogOpen} orientation="vertical">
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Replace your current draft?</AlertDialog.Title>
                <AlertDialog.Description>
                    Switching to
                    {builtInThemePresets.find((preset) => preset.slug === pendingPreset)
                        ?.name ?? 'this preset'}
                    resets every changed color, type, shape, and motion value.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit onclick={() => (pendingPreset = null)}>
                    Keep draft
                    <Shortcut shortcut="esc" />
                </AlertDialog.Exit>
                <AlertDialog.Confirm onclick={confirmPresetChange}>
                    Replace draft
                    <Shortcut shortcut="enter" />
                </AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
