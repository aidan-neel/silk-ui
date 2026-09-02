<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
    import CreditCard from '@lucide/svelte/icons/credit-card';
    import Download from '@lucide/svelte/icons/download';
    import FileText from '@lucide/svelte/icons/file-text';
    import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
    import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
    import Palette from '@lucide/svelte/icons/palette';
    import Plus from '@lucide/svelte/icons/plus';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import Search from '@lucide/svelte/icons/search';
    import Settings from '@lucide/svelte/icons/settings';
    import Users from '@lucide/svelte/icons/users';
    import WalletCards from '@lucide/svelte/icons/wallet-cards';
    import * as Alert from '@sivir-ui/svelte/components/alert';
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import * as Breadcrumb from '@sivir-ui/svelte/components/breadcrumb';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import { Gauge } from '@sivir-ui/svelte/components/gauge';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { Pagination } from '@sivir-ui/svelte/components/pagination';
    import { Progress, type ProgressProps } from '@sivir-ui/svelte/components/progress';
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
    import * as Select from '@sivir-ui/svelte/components/select';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import { Slider, type SliderProps } from '@sivir-ui/svelte/components/slider';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { toast } from '@sivir-ui/svelte/components/toast';
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

    type FoundationPalette = {
        base: string;
        border: string;
        background: string;
        secondary: string;
        muted: string;
    };

    type FoundationColors = {
        light: FoundationPalette;
        dark: FoundationPalette;
    };

    type StudioExtensions = {
        presetSlug: string;
        headerSize: number;
        headerWeight: FontWeight;
        roleWeights: RoleWeights;
        foundationColors: FoundationColors;
        advancedTokens: AdvancedTokens;
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
            muted: '#f7f7f5'
        },
        dark: {
            base: '#171717',
            border: '#2a2a2a',
            background: '#0a0a0a',
            secondary: '#252525',
            muted: '#1a1a1a'
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

    const brandSwatches = [
        { label: 'Sivir blue', value: '#1f9be6' },
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
    const mutedSwatches = [
        { label: 'Whisper', value: '#f7f7f5' },
        { label: 'Fog', value: '#eeeeec' },
        { label: 'Ash', value: '#242424' },
        { label: 'Coal', value: '#1a1a1a' }
    ];

    const colorTokenDefinitions = [
        { name: '--sivir-neutral-0', fallback: 'hsl(0 0% 100%)', darkFallback: 'hsl(0 0% 5%)' },
        { name: '--sivir-neutral-10', fallback: 'hsl(60 11.1% 99.2%)' },
        {
            name: '--sivir-neutral-50',
            fallback: 'hsl(60 11.1% 96.5%)',
            darkFallback: 'hsl(0 0% 10%)'
        },
        {
            name: '--sivir-neutral-100',
            fallback: 'hsl(60 6.2% 93.7%)',
            darkFallback: 'hsl(0 0% 13%)'
        },
        {
            name: '--sivir-neutral-150',
            fallback: 'hsl(60 4.2% 90.6%)',
            darkFallback: 'hsl(0 0% 15.7%)'
        },
        {
            name: '--sivir-neutral-300',
            fallback: 'hsl(60 4.4% 82.4%)',
            darkFallback: 'hsl(0 0% 22.7%)'
        },
        {
            name: '--sivir-neutral-500',
            fallback: 'hsl(60 3% 41.5%)',
            darkFallback: 'hsl(0 0% 65%)'
        },
        {
            name: '--sivir-neutral-900',
            fallback: 'hsl(60 5.7% 10.4%)',
            darkFallback: 'hsl(0 0% 93%)'
        },
        {
            name: '--sivir-blue-50',
            fallback: 'hsl(218.8 100% 96.7%)',
            darkFallback: 'hsl(217.1 52.5% 15.7%)'
        },
        {
            name: '--sivir-blue-500',
            fallback: 'hsl(212.2 100% 64.5%)',
            darkFallback: 'hsl(216.6 100% 67.8%)'
        },
        {
            name: '--sivir-success',
            fallback: 'hsl(148.7 42.2% 42.7%)',
            darkFallback: 'hsl(149.7 39.4% 49.2%)'
        },
        {
            name: '--sivir-warning',
            fallback: 'hsl(36.1 64.8% 47.8%)',
            darkFallback: 'hsl(37.3 72.6% 55.7%)'
        },
        {
            name: '--sivir-error',
            fallback: 'hsl(0 57.7% 56.5%)',
            darkFallback: 'hsl(0 66.7% 63.5%)'
        },
        {
            name: '--color-background',
            fallback: 'var(--sivir-neutral-10)',
            darkFallback: 'hsl(0 0% 4%)'
        },
        { name: '--color-card', fallback: 'var(--sivir-neutral-0)', darkFallback: 'hsl(0 0% 9%)' },
        {
            name: '--color-panel',
            fallback: 'var(--sivir-neutral-0)',
            darkFallback: 'hsl(0 0% 11.5%)'
        },
        {
            name: '--color-muted',
            fallback: 'var(--sivir-neutral-50)',
            darkFallback: 'hsl(0 0% 7%)'
        },
        {
            name: '--color-secondary',
            fallback: 'var(--sivir-neutral-100)',
            darkFallback: 'hsl(0 0% 14.5%)'
        },
        {
            name: '--color-border',
            fallback: 'var(--sivir-neutral-150)',
            darkFallback: 'hsl(0 0% 16.5%)'
        },
        {
            name: '--color-border-strong',
            fallback: 'var(--sivir-neutral-300)',
            darkFallback: 'hsl(0 0% 26%)'
        },
        {
            name: '--color-input',
            fallback: 'var(--sivir-neutral-300)',
            darkFallback: 'hsl(0 0% 24%)'
        },
        { name: '--color-foreground', fallback: 'var(--sivir-neutral-900)' },
        { name: '--color-foreground-muted', fallback: 'var(--sivir-neutral-500)' },
        { name: '--color-primary', fallback: '#1f9be6' },
        { name: '--color-primary-hover', fallback: '#1270ad' },
        { name: '--color-on-primary', fallback: 'hsl(0 0% 100%)' },
        { name: '--color-accent-tint', fallback: 'var(--sivir-blue-50)' },
        {
            name: '--color-ring',
            fallback: 'color-mix(in srgb, var(--color-primary) 30%, transparent)'
        },
        {
            name: '--color-overlay',
            fallback: 'rgb(0 0 0 / 0.18)',
            darkFallback: 'rgb(0 0 0 / 0.55)'
        },
        { name: '--color-success', fallback: 'var(--sivir-success)' },
        { name: '--color-warning', fallback: 'var(--sivir-warning)' },
        { name: '--color-error', fallback: 'var(--sivir-error)' },
        { name: '--color-info', fallback: 'var(--sivir-blue-500)' },
        { name: '--color-tooltip', fallback: 'var(--sivir-neutral-900)' },
        { name: '--color-tooltip-foreground', fallback: 'var(--sivir-neutral-0)' },
        {
            name: '--color-field',
            fallback: 'var(--color-card)',
            darkFallback: 'var(--color-secondary)'
        },
        {
            name: '--color-field-hover',
            fallback: 'var(--color-muted)',
            darkFallback: 'hsl(0 0% 17.5%)'
        },
        { name: '--color-field-foreground', fallback: 'var(--color-foreground)' }
    ] as const;
    const spacingTokenDefinitions = [
        { name: '--sivir-space-unit', fallback: '3.6px' },
        { name: '--sivir-space-1', fallback: 'calc(var(--sivir-space-unit) * 1)' },
        { name: '--sivir-space-2', fallback: 'calc(var(--sivir-space-unit) * 2)' },
        { name: '--sivir-space-3', fallback: 'calc(var(--sivir-space-unit) * 3)' },
        { name: '--sivir-space-4', fallback: 'calc(var(--sivir-space-unit) * 4)' },
        { name: '--sivir-space-5', fallback: 'calc(var(--sivir-space-unit) * 5)' },
        { name: '--sivir-space-6', fallback: 'calc(var(--sivir-space-unit) * 6)' },
        { name: '--sivir-space-8', fallback: 'calc(var(--sivir-space-unit) * 8)' },
        { name: '--sivir-space-10', fallback: 'calc(var(--sivir-space-unit) * 10)' },
        { name: '--size-control-sm', fallback: 'var(--sivir-space-8)' },
        {
            name: '--size-control-md',
            fallback: 'calc(var(--sivir-space-8) + var(--sivir-space-2))'
        },
        { name: '--size-control-lg', fallback: 'var(--sivir-space-10)' },
        { name: '--size-icon-md', fallback: 'var(--sivir-space-8)' },
        { name: '--radius-sm', fallback: '6px' },
        { name: '--radius-md', fallback: '8px' },
        { name: '--radius-lg', fallback: '10px' },
        { name: '--radius-xl', fallback: '14px' },
        { name: '--border-size', fallback: '1px' }
    ] as const;
    const animationTokenDefinitions = [
        { name: '--motion-duration-hover', fallback: '120ms' },
        { name: '--motion-duration-menu', fallback: '40ms' },
        { name: '--motion-duration-panel', fallback: '180ms' },
        { name: '--motion-duration-sheet', fallback: '320ms' },
        { name: '--motion-duration-sheet-out', fallback: '220ms' },
        { name: '--motion-duration-overlay', fallback: '120ms' },
        { name: '--motion-duration-toast-in', fallback: '320ms' },
        { name: '--motion-duration-toast-out', fallback: '240ms' },
        { name: '--motion-panel-y', fallback: '2px' },
        { name: '--motion-panel-scale-start', fallback: '0.97' },
        { name: '--motion-duration-panel-in', fallback: '110ms' },
        { name: '--motion-duration-panel-out', fallback: '150ms' },
        { name: '--motion-duration-modal-in', fallback: '180ms' },
        { name: '--motion-duration-modal-out', fallback: '110ms' },
        { name: '--motion-press-px', fallback: '2px' },
        { name: '--motion-duration-press', fallback: '160ms' },
        { name: '--motion-duration-item', fallback: '160ms' },
        { name: '--ease-out', fallback: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        { name: '--ease-press', fallback: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        { name: '--ease-in-out', fallback: 'cubic-bezier(0.77, 0, 0.175, 1)' }
    ] as const;

    type ColorTokenName = (typeof colorTokenDefinitions)[number]['name'];
    type SpacingTokenName = (typeof spacingTokenDefinitions)[number]['name'];
    type AnimationTokenName = (typeof animationTokenDefinitions)[number]['name'];
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
    const densityValues = {
        compact: '3.2px',
        default: '3.6px',
        comfortable: '4px'
    } as const;
    const dashboardNavItems = [
        { label: 'Overview', icon: LayoutDashboard },
        { label: 'Invoices', icon: FileText, badge: '9' },
        { label: 'Payments', icon: CreditCard },
        { label: 'Customers', icon: Users },
        { label: 'Accounts', icon: WalletCards },
        { label: 'Settings', icon: Settings }
    ];
    const dashboardStats = [
        {
            label: 'Outstanding',
            value: '$48,120',
            detail: 'Across 9 invoices',
            change: '+8.4%',
            progress: 64,
            destructive: false
        },
        {
            label: 'Collected',
            value: '$112,400',
            detail: '82% of monthly target',
            change: '+12.1%',
            progress: 82,
            destructive: false
        },
        {
            label: 'Overdue',
            value: '$9,860',
            detail: '3 invoices need action',
            change: '-2.6%',
            progress: 22,
            destructive: true
        },
        {
            label: 'Available cash',
            value: '$186,240',
            detail: 'Across 4 accounts',
            change: '+4.3%',
            progress: 72,
            destructive: false
        }
    ];
    const invoices = [
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
        }
    ] as const;
    const collectionActivity = [
        {
            initials: 'KL',
            client: 'Kestrel Logistics',
            detail: 'Reminder scheduled',
            time: '12 min'
        },
        { initials: 'HS', client: 'Halcyon Studio', detail: 'Invoice viewed', time: '1 hr' },
        { initials: 'NT', client: 'Northwind Trading', detail: 'Payment reconciled', time: '3 hr' }
    ];
    let theme = $state<Theme>({
        ...DEFAULT_THEME,
        slug: 'midnight-ledger',
        name: 'Midnight Ledger'
    });
    let baseTheme = $state<Theme>({ ...DEFAULT_THEME });
    let selectedPreset = $state(DEFAULT_THEME.slug);
    let previousPreset = $state(DEFAULT_THEME.slug);
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
    let advancedTab = $state<AdvancedTab>('colors');
    let moreOptionsOpen = $state(false);
    let pendingPreset = $state<string | null>(null);
    let presetDialogOpen = $state(false);
    let activeDashboardNav = $state('Overview');
    let dashboardRange = $state('30d');
    let invoiceQuery = $state('');
    let invoiceStatus = $state('all');
    let invoicePage = $state(1);
    let autoReconcile = $state(true);
    let selectedInvoices = $state<Record<(typeof invoices)[number]['reference'], boolean>>({
        'INV-2291': false,
        'INV-2288': false,
        'INV-2279': false,
        'INV-2274': false,
        'INV-2268': false
    });
    let copiedKey = $state<'css' | 'json' | null>(null);
    let hydrated = $state(false);
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
            foundationColorChanges +
            advancedTokenChanges +
            (headerSize === 16 ? 0 : 1) +
            (headerWeight === '600' ? 0 : 1) +
            roleWeightChanges
    );
    const dirty = $derived(changedAxisCount > 0);
    const generatedCss = $derived(
        `${themeToCss(theme)}\n:root,\n.dark {\n\t--font-size-header: ${headerSize}px;\n\t--font-weight-header: ${headerWeight};\n\t--font-weight-body: ${roleWeights.body};\n\t--font-weight-label: ${roleWeights.label};\n\t--font-weight-button: ${roleWeights.button};\n\t--font-weight-badge: ${roleWeights.badge};\n\t--font-weight-description: ${roleWeights.description};\n}\n${foundationCssBlock(':root', foundationColors.light)}${foundationCssBlock('.dark', foundationColors.dark)}${tokenOverridesCssBlock(':root', advancedTokens.colors.light)}${tokenOverridesCssBlock('.dark', advancedTokens.colors.dark)}${tokenOverridesCssBlock(':root,\n.dark', advancedTokens.spacing)}${tokenOverridesCssBlock(':root,\n.dark', advancedTokens.animation)}`
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
                    foundationColors,
                    advancedTokens
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
            `--color-background: ${colors.background};`,
            `--color-secondary: ${colors.secondary};`,
            `--color-muted: ${colors.muted};`
        ];

        return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
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
                foundationColors = {
                    light: {
                        ...DEFAULT_FOUNDATION_COLORS.light,
                        ...value.foundationColors.light
                    },
                    dark: {
                        ...DEFAULT_FOUNDATION_COLORS.dark,
                        ...value.foundationColors.dark
                    }
                };
            }
            if (value.advancedTokens) {
                advancedTokens = {
                    colors: {
                        light: { ...value.advancedTokens.colors?.light },
                        dark: { ...value.advancedTokens.colors?.dark }
                    },
                    spacing: { ...value.advancedTokens.spacing },
                    animation: { ...value.advancedTokens.animation }
                };
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
            }
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
        syncFontSelections(theme);
    }

    function updateBrand(value: string) {
        theme = { ...theme, brand: value.toLowerCase() };
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

    function resetAdvancedTab() {
        if (advancedTab === 'colors') {
            advancedTokens = {
                ...advancedTokens,
                colors: { ...advancedTokens.colors, [appMode]: {} }
            };
            return;
        }
        if (advancedTab === 'spacing') {
            advancedTokens = { ...advancedTokens, spacing: {} };
            return;
        }
        advancedTokens = { ...advancedTokens, animation: {} };
    }

    function colorTokenFallback(definition: (typeof colorTokenDefinitions)[number]) {
        if (appMode === 'dark' && 'darkFallback' in definition) {
            return definition.darkFallback;
        }
        return definition.fallback;
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

    async function copyValue(value: string, key: 'css' | 'json', label: string) {
        if (!navigator.clipboard) {
            toast({ title: `${label} could not be copied`, type: 'error', duration: 1800 });
            return;
        }

        await navigator.clipboard.writeText(value);
        copiedKey = key;
        toast({
            title: `${label} copied`,
            description: 'The draft is ready to paste into your project.',
            type: 'success',
            duration: 1600
        });
        window.setTimeout(() => {
            if (copiedKey === key) copiedKey = null;
        }, 1200);
    }

    function runDashboardAction(title: string, description: string) {
        toast({ title, description, type: 'success', duration: 1800 });
    }

    onMount(() => {
        const storedTheme = loadStudioTheme();
        if (storedTheme) {
            theme = { ...storedTheme };
            syncFontSelections(theme);
        }
        loadStudioExtensions();
        hydrated = true;
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
        <Tabs.Root bind:value={selection.value} variant="segmented" class="w-full">
            <Tabs.List class={`grid w-full ${values.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
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
        <Tabs.Root bind:value={selection.value} variant="segmented" class="min-w-0 flex-1">
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

{#snippet tokenField(
    name: string,
    value: string | undefined,
    placeholder: string,
    onChange: (value: string) => void
)}
    <Input
        label={name}
        value={value ?? ''}
        {placeholder}
        class="font-mono text-xs"
        autocomplete="off"
        oninput={(event) => {
            onChange(event.currentTarget.value);
        }}
    />
{/snippet}

{#snippet inspector()}
    <ScrollArea class="hide-scrollbar-all h-full min-h-0 flex-1 bg-background" showCues={false}>
        <div class="flex min-h-full flex-col gap-5 px-2 py-4">
            <div class="flex shrink-0 flex-col gap-3">
                <div class="flex min-w-0 items-center gap-2">
                    <span class="shrink-0 text-sm font-semibold tracking-[-0.015em]"
                        >Theme studio</span
                    >
                    <span class="text-[var(--sivir-neutral-300)]" aria-hidden="true">/</span>
                    <span class="truncate font-mono text-xs text-foreground-muted"
                        >{theme.slug}</span
                    >
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <Button
                        variant="secondary"
                        class="h-8"
                        onclick={() => copyValue(generatedJson, 'json', 'JSON')}
                    >
                        {copiedKey === 'json' ? 'Copied' : 'Copy JSON'}
                    </Button>
                    <Button
                        variant="secondary"
                        class="h-8"
                        onclick={() => copyValue(generatedCss, 'css', 'CSS')}
                    >
                        {copiedKey === 'css' ? 'Copied' : 'Copy CSS'}
                    </Button>
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
                    <Select.Content>
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

            <Card.Root
                class="shrink-0 overflow-hidden !rounded-[var(--radius-xl)] !border-0 p-0 shadow-[var(--elevation-1)]"
            >
                <div class="flex items-center justify-between gap-2 px-2 pt-3 pb-1">
                    <h2 class="text-sm font-semibold tracking-[-0.015em]">Color</h2>
                    {@render moreOptionsButton('colors', 'More color options')}
                </div>
                <Card.Content class="gap-4 px-2 pb-3">
                    {@render colorPickerControl('Brand', theme.brand, brandSwatches, updateBrand)}
                    <div class="grid grid-cols-2 gap-2">
                        {@render colorPickerControl('Base', foundationColors[appMode].base, baseSwatches, (value) => {
                            updateFoundationColor('base', value);
                        })}
                        {@render colorPickerControl('Border', foundationColors[appMode].border, borderSwatches, (value) => {
                            updateFoundationColor('border', value);
                        })}
                        {@render colorPickerControl('Background', foundationColors[appMode].background, backgroundSwatches, (value) => {
                            updateFoundationColor('background', value);
                        })}
                        {@render colorPickerControl('Secondary', foundationColors[appMode].secondary, secondarySwatches, (value) => {
                            updateFoundationColor('secondary', value);
                        })}
                        <div class="col-span-2">
                            {@render colorPickerControl('Muted', foundationColors[appMode].muted, mutedSwatches, (value) => {
                                updateFoundationColor('muted', value);
                            })}
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root
                class="shrink-0 overflow-hidden !rounded-[var(--radius-xl)] !border-0 p-0 shadow-[var(--elevation-1)]"
            >
                <div class="flex items-center justify-between gap-2 px-2 pt-3 pb-1">
                    <h2 class="text-sm font-semibold tracking-[-0.015em]">Shape & density</h2>
                    {@render moreOptionsButton('spacing', 'More shape and density options')}
                </div>
                <Card.Content class="gap-4 px-2 pb-3">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-baseline justify-between gap-2">
                            <span class="text-[13px] font-medium text-foreground-muted"
                                >Radius</span
                            >
                            <span class="font-mono text-xs tabular-nums text-foreground-muted">
                                {radiusValues[theme.radius]}
                            </span>
                        </div>
                        {@render segmentedChoice(radiusScales, theme.radius, 'Radius scale', (value) => {
                            if (radiusScales.includes(value as Theme['radius'])) {
                                theme = { ...theme, radius: value as Theme['radius'] };
                            }
                        })}
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-baseline justify-between gap-2">
                            <span class="text-[13px] font-medium text-foreground-muted"
                                >Density</span
                            >
                            <span class="font-mono text-xs tabular-nums text-foreground-muted">
                                {densityValues[theme.density]}
                            </span>
                        </div>
                        {@render segmentedChoice(densities, theme.density, 'Interface density', (value) => {
                            if (densities.includes(value as Theme['density'])) {
                                theme = { ...theme, density: value as Theme['density'] };
                            }
                        })}
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root
                class="shrink-0 overflow-hidden !rounded-[var(--radius-xl)] !border-0 p-0 shadow-[var(--elevation-1)]"
            >
                <div class="px-2 pt-3 pb-1">
                    <h2 class="text-sm font-semibold tracking-[-0.015em]">Typography</h2>
                </div>
                <Card.Content class="gap-4 px-2 pb-3">
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex min-w-0 flex-col gap-2">
                            <span class="text-[13px] font-medium text-foreground-muted">Sans</span>
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
                                <Select.Content>
                                    {#each sansFonts as font (font.key)}
                                        <Select.Item value={font.key} label={font.label}
                                            >{font.label}</Select.Item
                                        >
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        </div>
                        <div class="flex min-w-0 flex-col gap-2">
                            <span class="text-[13px] font-medium text-foreground-muted"
                                >Header</span
                            >
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
                                <Select.Content>
                                    {#each headerFonts as font (font.key)}
                                        <Select.Item value={font.key} label={font.label}
                                            ><span style:font-family={font.value}
                                                >{font.label}</span
                                            ></Select.Item
                                        >
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        </div>
                    </div>
                    <div class="flex min-w-0 flex-col gap-2">
                        <span class="text-[13px] font-medium text-foreground-muted">Mono</span>
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
                            <Select.Content>
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
                            <span class="text-[13px] font-medium text-foreground-muted"
                                >Header size</span
                            >
                            <span class="font-mono text-xs tabular-nums text-foreground-muted"
                                >{headerSize}px</span
                            >
                        </div>
                        <Slider {...headerSliderProps()} />
                    </div>
                    <div class="flex flex-col gap-2.5">
                        <span class="text-[13px] font-medium text-foreground-muted"
                            >Font weights</span
                        >
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
                </Card.Content>
            </Card.Root>

            <Card.Root
                class="shrink-0 overflow-hidden !rounded-[var(--radius-xl)] !border-0 p-0 shadow-[var(--elevation-1)]"
            >
                <div class="flex items-center justify-between gap-2 px-2 pt-3 pb-1">
                    <h2 class="text-sm font-semibold tracking-[-0.015em]">Motion</h2>
                    {@render moreOptionsButton('animation', 'More motion options')}
                </div>
                <Card.Content class="gap-4 px-2 pb-3">
                    {@render segmentedChoice(motionFeels, theme.motion, 'Motion feel', (value) => {
                        if (motionFeels.includes(value as Theme['motion'])) {
                            theme = { ...theme, motion: value as Theme['motion'] };
                        }
                    })}
                </Card.Content>
            </Card.Root>
        </div>
    </ScrollArea>
{/snippet}

{#snippet dashboardPreview()}
    <div
        class="flex h-full min-h-[720px] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background"
    >
        <aside
            class="m-3 mr-0 hidden min-h-0 w-[196px] shrink-0 overflow-hidden rounded-[var(--radius-xl)] bg-panel shadow-[var(--elevation-1)] min-[820px]:flex"
        >
            <ScrollArea class="hide-scrollbar-all h-full min-h-0" showCues={false}>
                <div class="flex min-h-full flex-col p-3">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger variant="quiet" class="w-full justify-between px-2">
                            <span class="flex min-w-0 items-center gap-2">
                                <Avatar.Root size="sm" shape="square" class="shrink-0">
                                    <Avatar.Fallback>NL</Avatar.Fallback>
                                </Avatar.Root>
                                <span class="truncate text-left text-sm font-medium"
                                    >Northstar Ledger</span
                                >
                            </span>
                            <ChevronDown size={14} class="shrink-0 text-foreground-muted" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content class="min-w-[190px]">
                            <DropdownMenu.Label>Workspaces</DropdownMenu.Label>
                            <DropdownMenu.Item>Northstar Ledger</DropdownMenu.Item>
                            <DropdownMenu.Item>Personal books</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                                callback={() =>
                            runDashboardAction('Workspace created', 'A blank ledger is ready.')}
                                >Create workspace</DropdownMenu.Item
                            >
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    <nav aria-label="Ledger navigation" class="mt-4 flex flex-col gap-1">
                        {#each dashboardNavItems as item (item.label)}
                            <Button
                                variant={activeDashboardNav === item.label ? 'secondary' : 'ghost'}
                                class="w-full justify-start"
                                onclick={() => (activeDashboardNav = item.label)}
                            >
                                <item.icon size={15} />
                                <span class="flex-1 text-left">{item.label}</span>
                                {#if item.badge}
                                    <Badge variant="secondary" class="ml-auto">{item.badge}</Badge>
                                {/if}
                            </Button>
                        {/each}
                    </nav>

                    <div class="mt-auto flex flex-col gap-3">
                        <Card.Root
                            class="gap-2 !rounded-[var(--radius-xl)] !border-0 p-3 shadow-[var(--elevation-1)]"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <Typography.Metadata>Monthly volume</Typography.Metadata>
                                <Typography.Metadata>72%</Typography.Metadata>
                            </div>
                            <Progress value={72} />
                            <Typography.Description class="text-xs">
                                $186k of the $260k plan
                            </Typography.Description>
                        </Card.Root>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger variant="ghost" class="w-full justify-start px-2">
                                <Avatar.Root size="sm" class="shrink-0">
                                    <Avatar.Fallback>AN</Avatar.Fallback>
                                </Avatar.Root>
                                <span class="min-w-0 flex-1 text-left">
                                    <span class="block truncate text-sm font-medium"
                                        >Avery Nguyen</span
                                    >
                                    <span class="block truncate text-xs text-foreground-muted"
                                        >Finance admin</span
                                    >
                                </span>
                                <ChevronDown size={14} class="text-foreground-muted" />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content class="min-w-[190px]">
                                <DropdownMenu.Item>Account settings</DropdownMenu.Item>
                                <DropdownMenu.Item>Billing</DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item>Sign out</DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                </div>
            </ScrollArea>
        </aside>

        <div class="flex min-w-0 flex-1 flex-col">
            <header
                class="mx-3 mt-3 flex h-[54px] shrink-0 items-center justify-between gap-3 rounded-[var(--radius-xl)] bg-card px-4 shadow-[var(--elevation-1)]"
            >
                <Breadcrumb.Root>
                    <Breadcrumb.Item>Finance</Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>{activeDashboardNav}</Breadcrumb.Item>
                </Breadcrumb.Root>
                <div class="flex min-w-0 items-center gap-2">
                    <Input
                        bind:value={invoiceQuery}
                        class="hidden w-[220px] text-sm sm:block"
                        placeholder="Search ledger…"
                        aria-label="Search ledger"
                    >
                        {#snippet leading()}
                            <Search size={14} />
                        {/snippet}
                    </Input>
                    <Tooltip.Root placement="bottom">
                        <Tooltip.Trigger>
                            <Button variant="ghost" size="icon" aria-label="Notifications">
                                <Bell size={16} />
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>3 unread notifications</Tooltip.Content>
                    </Tooltip.Root>
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
                        <DropdownMenu.Content class="min-w-[170px]">
                            <DropdownMenu.Label>Avery Nguyen</DropdownMenu.Label>
                            <DropdownMenu.Item>Profile</DropdownMenu.Item>
                            <DropdownMenu.Item>Preferences</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>Sign out</DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            </header>

            <ScrollArea class="min-h-0 flex-1" showCues={false}>
                <div class="flex min-h-full flex-col gap-4 p-4 sm:p-5">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <Typography.Title level={1}>{activeDashboardNav}</Typography.Title>
                            <Typography.Description>
                                Track cash, collect invoices, and reconcile every account from one
                                workspace.
                            </Typography.Description>
                        </div>
                        <div class="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto">
                            <div role="group" aria-label="Dashboard range">
                                <Tabs.Root bind:value={dashboardRange} variant="segmented">
                                    <Tabs.List>
                                        {#each ['7d', '30d', 'Quarter'] as range (range)}
                                            <Tabs.Trigger
                                                value={range}
                                                class="min-h-8 px-2 py-0 text-xs"
                                                >{range}</Tabs.Trigger
                                            >
                                        {/each}
                                    </Tabs.List>
                                </Tabs.Root>
                            </div>
                            <Button
                                variant="outline"
                                onclick={() =>
                                    runDashboardAction(
                                        'Report exported',
                                        'The current ledger report is ready.'
                                    )}
                            >
                                <Download size={15} />
                                Export
                            </Button>
                            <Button
                                onclick={() =>
                                    runDashboardAction(
                                        'Invoice draft created',
                                        'Add a customer and line items to continue.'
                                    )}
                            >
                                <Plus size={15} />
                                New invoice
                            </Button>
                        </div>
                    </div>

                    <Alert.Root variant="warning">
                        <Alert.Title>Three invoices are overdue</Alert.Title>
                        <Alert.Description>
                            $9,860 is past due. The next collection run starts tomorrow at 9:00 AM.
                        </Alert.Description>
                    </Alert.Root>

                    <section
                        aria-label="Ledger summary"
                        class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        {#each dashboardStats as stat (stat.label)}
                            <Card.Root
                                class="gap-3 !rounded-[var(--radius-xl)] !border-0 p-4 shadow-[var(--elevation-1)]"
                            >
                                <div class="flex items-center justify-between gap-2">
                                    <Typography.Metadata>{stat.label}</Typography.Metadata>
                                    <Badge variant={stat.destructive ? 'error' : 'success'}>
                                        {stat.change}
                                    </Badge>
                                </div>
                                <Typography.H2 class="tabular-nums">{stat.value}</Typography.H2>
                                <Progress {...progressProps(stat.progress, stat.destructive)} />
                                <Typography.Description class="text-xs">
                                    {stat.detail}
                                </Typography.Description>
                            </Card.Root>
                        {/each}
                    </section>

                    <div
                        class="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(240px,0.8fr)]"
                    >
                        <Card.Root
                            class="min-h-0 overflow-hidden !rounded-[var(--radius-xl)] !border-0 p-0 shadow-[var(--elevation-1)]"
                        >
                            <div
                                class="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div>
                                    <Typography.Title level={2}>Invoice queue</Typography.Title>
                                    <Typography.Description>
                                        Review, collect, and reconcile customer invoices.
                                    </Typography.Description>
                                </div>
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <Input
                                        bind:value={invoiceQuery}
                                        class="w-full text-sm sm:w-[190px]"
                                        placeholder="Client or invoice…"
                                        aria-label="Search invoices"
                                    >
                                        {#snippet leading()}
                                            <Search size={14} />
                                        {/snippet}
                                    </Input>
                                    <Select.Root bind:value={invoiceStatus}>
                                        <Select.Trigger
                                            class="w-full min-w-[126px] text-sm sm:w-auto"
                                            variant="outline"
                                            aria-label="Invoice status"
                                        >
                                            {invoiceStatus === 'all'
                                                ? 'All statuses'
                                                : invoiceStatus === 'open'
                                                  ? 'Open'
                                                  : formatChoice(invoiceStatus)}
                                        </Select.Trigger>
                                        <Select.Content>
                                            <Select.Item value="all" label="All statuses"
                                                >All statuses</Select.Item
                                            >
                                            <Select.Item value="open" label="Open"
                                                >Open</Select.Item
                                            >
                                            <Select.Item value="paid" label="Paid"
                                                >Paid</Select.Item
                                            >
                                            <Select.Item value="overdue" label="Overdue"
                                                >Overdue</Select.Item
                                            >
                                        </Select.Content>
                                    </Select.Root>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table
                                    class="w-full min-w-[760px] border-collapse text-left text-sm"
                                >
                                    <thead>
                                        <tr class="border-b border-border/40 text-foreground-muted">
                                            <th class="w-10 px-4 py-2 font-medium">
                                                <Checkbox
                                                    checked={false}
                                                    label="Select all invoices"
                                                    class="[&>div]:sr-only"
                                                />
                                            </th>
                                            <th class="px-2 py-2 font-medium">Customer</th>
                                            <th class="px-3 py-2 font-medium">Invoice</th>
                                            <th class="px-3 py-2 font-medium">Due</th>
                                            <th class="px-3 py-2 text-right font-medium">Amount</th>
                                            <th class="px-3 py-2 font-medium">Status</th>
                                            <th class="w-12 px-3 py-2">
                                                <span class="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each visibleInvoices as invoice (invoice.reference)}
                                            <tr
                                                class="border-b border-border/40 last:border-b-0 hover:bg-muted"
                                            >
                                                <td class="px-4 py-2.5">
                                                    <Checkbox
                                                        bind:checked={selectedInvoices[invoice.reference]}
                                                        label={`Select ${invoice.reference}`}
                                                        class="[&>div]:sr-only"
                                                    />
                                                </td>
                                                <td class="px-2 py-2.5">
                                                    <div class="flex items-center gap-2.5">
                                                        <Avatar.Root size="sm" shape="square">
                                                            <Avatar.Fallback
                                                                >{invoice.initials}</Avatar.Fallback
                                                            >
                                                        </Avatar.Root>
                                                        <span class="font-medium"
                                                            >{invoice.client}</span
                                                        >
                                                    </div>
                                                </td>
                                                <td
                                                    class="px-3 py-2.5 font-mono text-xs text-foreground-muted"
                                                >
                                                    {invoice.reference}
                                                </td>
                                                <td class="px-3 py-2.5 text-foreground-muted">
                                                    {invoice.due}
                                                </td>
                                                <td
                                                    class="px-3 py-2.5 text-right font-medium tabular-nums"
                                                >
                                                    {invoice.amount}
                                                </td>
                                                <td class="px-3 py-2.5">
                                                    <Badge
                                                        variant={invoice.status === 'Paid'
                                                            ? 'success'
                                                            : invoice.status === 'Overdue'
                                                              ? 'error'
                                                              : invoice.status === 'Due soon'
                                                                ? 'warning'
                                                                : 'secondary'}
                                                        >{invoice.status}</Badge
                                                    >
                                                </td>
                                                <td class="px-3 py-2.5">
                                                    <DropdownMenu.Root>
                                                        <DropdownMenu.Trigger
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Actions for ${invoice.reference}`}
                                                        >
                                                            <MoreHorizontal size={16} />
                                                        </DropdownMenu.Trigger>
                                                        <DropdownMenu.Content class="min-w-[160px]">
                                                            <DropdownMenu.Item
                                                                >Open invoice</DropdownMenu.Item
                                                            >
                                                            <DropdownMenu.Item
                                                                >Send reminder</DropdownMenu.Item
                                                            >
                                                            <DropdownMenu.Item
                                                                >Record payment</DropdownMenu.Item
                                                            >
                                                            <DropdownMenu.Separator />
                                                            <DropdownMenu.Item
                                                                >Duplicate</DropdownMenu.Item
                                                            >
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Root>
                                                </td>
                                            </tr>
                                        {:else}
                                            <tr>
                                                <td colspan="7" class="p-4">
                                                    <Alert.Root variant="info">
                                                        <Alert.Title>No invoices found</Alert.Title>
                                                        <Alert.Description>
                                                            Change the search or status filter to
                                                            see more invoices.
                                                        </Alert.Description>
                                                    </Alert.Root>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>

                            <div
                                class="flex flex-col gap-3 border-t border-border/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <Typography.Metadata>
                                    Showing {visibleInvoices.length} of {invoices.length} invoices
                                </Typography.Metadata>
                                <Pagination bind:page={invoicePage} total={4} />
                            </div>
                        </Card.Root>

                        <div class="flex min-w-0 flex-col gap-4">
                            <Card.Root
                                class="gap-4 !rounded-[var(--radius-xl)] !border-0 p-4 shadow-[var(--elevation-1)]"
                            >
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <Typography.Title level={2}>Cash coverage</Typography.Title>
                                        <Typography.Description>
                                            Funds available for the next 30 days.
                                        </Typography.Description>
                                    </div>
                                    <Gauge value={72} label="Cash coverage" tone="success" size={64}
                                        >72%</Gauge
                                    >
                                </div>
                                <div class="flex flex-col gap-3">
                                    <div>
                                        <div class="mb-1.5 flex items-center justify-between gap-2">
                                            <Typography.Metadata
                                                >Operating account</Typography.Metadata
                                            >
                                            <Typography.Metadata>$142,600</Typography.Metadata>
                                        </div>
                                        <Progress value={78} />
                                    </div>
                                    <div>
                                        <div class="mb-1.5 flex items-center justify-between gap-2">
                                            <Typography.Metadata>Tax reserve</Typography.Metadata>
                                            <Typography.Metadata>$43,640</Typography.Metadata>
                                        </div>
                                        <Progress value={38} />
                                    </div>
                                </div>
                                <Switch
                                    bind:switched={autoReconcile}
                                    label="Auto-reconcile"
                                    description="Match confirmed bank payments."
                                />
                            </Card.Root>

                            <Card.Root
                                class="gap-4 !rounded-[var(--radius-xl)] !border-0 p-4 shadow-[var(--elevation-1)]"
                            >
                                <div class="flex items-center justify-between gap-2">
                                    <div>
                                        <Typography.Title level={2}
                                            >Collection activity</Typography.Title
                                        >
                                        <Typography.Description
                                            >Latest invoice events.</Typography.Description
                                        >
                                    </div>
                                    <CircleDollarSign size={18} class="text-foreground-muted" />
                                </div>
                                <div class="flex flex-col gap-3">
                                    {#each collectionActivity as activity (activity.client)}
                                        <div class="flex items-start gap-2.5">
                                            <Avatar.Root size="sm" shape="square" class="shrink-0">
                                                <Avatar.Fallback
                                                    >{activity.initials}</Avatar.Fallback
                                                >
                                            </Avatar.Root>
                                            <div class="min-w-0 flex-1">
                                                <Typography.Text
                                                    variant="supporting"
                                                    class="truncate text-foreground"
                                                >
                                                    {activity.client}
                                                </Typography.Text>
                                                <Typography.Metadata
                                                    >{activity.detail}</Typography.Metadata
                                                >
                                            </div>
                                            <Typography.Metadata class="shrink-0"
                                                >{activity.time}</Typography.Metadata
                                            >
                                        </div>
                                    {/each}
                                </div>
                                <Button variant="secondary" class="w-full">View activity</Button>
                            </Card.Root>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    </div>
{/snippet}

<div data-docs-page class="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground">
    <section
        aria-label="Theme workspace"
        class="flex min-h-0 flex-1 gap-3 bg-background min-[1100px]:pl-3"
    >
        <aside
            aria-label="Theme configuration"
            class="my-3 hidden min-h-0 w-[328px] shrink-0 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background p-1 shadow-[var(--elevation-1)] min-[1100px]:flex min-[1100px]:flex-col"
        >
            {@render inspector()}
        </aside>

        <div class="min-w-0 flex-1 overflow-auto p-3 min-[1100px]:pl-0">
            <div class="h-full min-h-0 font-[var(--font-sans)] text-foreground" id="theme-preview">
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
            <div class="-m-4 min-h-0 flex-1 overflow-hidden">
                {@render inspector()}
            </div>
        </Sheet.Content>
    </Sheet.Root>

    <Modal.Root bind:open={moreOptionsOpen} orientation="vertical">
        <Modal.Content
            size="xl"
            contentClass="!h-[min(44rem,calc(var(--sivir-viewport-height)-2rem))] !max-h-[min(44rem,calc(var(--sivir-viewport-height)-2rem))]"
            surfaceClass="!overflow-hidden"
        >
            <Modal.Header class="shrink-0">
                <Modal.Title>Advanced theme tokens</Modal.Title>
                <Modal.Description>
                    Override any token directly. Empty values continue to inherit from the selected
                    preset and the primary studio controls.
                </Modal.Description>
            </Modal.Header>
            <Modal.Body class="min-h-0 flex-1 overflow-hidden">
                <Tabs.Root
                    bind:value={advancedTab}
                    variant="segmented"
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
                            <Tabs.Root bind:value={appModeBinding.value} variant="segmented">
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
                            <div class="grid gap-3 pb-2 sm:grid-cols-2">
                                {#each colorTokenDefinitions as definition (definition.name)}
                                    {@render tokenField(
                                        definition.name,
                                        advancedTokens.colors[appMode][definition.name],
                                        colorTokenFallback(definition),
                                        (value) => {
                                            updateAdvancedColorToken(definition.name, value);
                                        }
                                    )}
                                {/each}
                            </div>
                        </ScrollArea>
                    </Tabs.Content>

                    <Tabs.Content
                        value="spacing"
                        class="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        <ScrollArea class="min-h-0 flex-1 pr-2">
                            <div class="grid gap-3 pb-2 sm:grid-cols-2">
                                {#each spacingTokenDefinitions as definition (definition.name)}
                                    {@render tokenField(
                                        definition.name,
                                        advancedTokens.spacing[definition.name],
                                        definition.fallback,
                                        (value) => {
                                            updateAdvancedSpacingToken(definition.name, value);
                                        }
                                    )}
                                {/each}
                            </div>
                        </ScrollArea>
                    </Tabs.Content>

                    <Tabs.Content
                        value="animation"
                        class="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        <ScrollArea class="min-h-0 flex-1 pr-2">
                            <div class="grid gap-3 pb-2 sm:grid-cols-2">
                                {#each animationTokenDefinitions as definition (definition.name)}
                                    {@render tokenField(
                                        definition.name,
                                        advancedTokens.animation[definition.name],
                                        definition.fallback,
                                        (value) => {
                                            updateAdvancedAnimationToken(definition.name, value);
                                        }
                                    )}
                                {/each}
                            </div>
                        </ScrollArea>
                    </Tabs.Content>
                </Tabs.Root>
            </Modal.Body>
            <Modal.Footer class="shrink-0">
                <Button variant="outline" class="w-full sm:flex-1" onclick={resetAdvancedTab}>
                    Reset {formatChoice(advancedTab)} overrides
                </Button>
                <Modal.Close variant="primary" class="w-full sm:flex-1">Done</Modal.Close>
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
                <AlertDialog.Exit onclick={() => (pendingPreset = null)}
                    >Keep draft</AlertDialog.Exit
                >
                <AlertDialog.Confirm onclick={confirmPresetChange}
                    >Replace draft</AlertDialog.Confirm
                >
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
