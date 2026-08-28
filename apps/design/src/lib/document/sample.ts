import { DEFAULT_THEME } from '@sivir-ui/svelte/themes/theme';
import { CATALOG_VERSION, getCatalogDefinition } from '../catalog/catalog';
import type { CatalogFamily } from '../catalog/types';
import { createCommonStyle, createLayoutStyle, createTypographyStyle } from './defaults';
import { parseDesignDocument } from './schema';
import {
    type ComponentNode,
    DESIGN_DOCUMENT_FORMAT,
    DESIGN_DOCUMENT_SCHEMA_VERSION,
    type DesignDocument,
    type JsonObject,
    type LayoutKind,
    type LayoutNode,
    type TextKind,
    type TextNode
} from './types';

function layoutNode(
    id: string,
    layout: LayoutKind,
    children: readonly string[],
    options: {
        readonly display?: 'block' | 'flex' | 'grid';
        readonly gap?: '0' | '1' | '2' | '3' | '4' | '6' | '8' | '12';
        readonly padding?: '0' | '1' | '2' | '3' | '4' | '6' | '8' | '12';
    } = {}
): LayoutNode {
    const style = createCommonStyle();
    const layoutStyle = createLayoutStyle();

    return {
        id,
        kind: 'layout',
        layout,
        children,
        style: {
            ...style,
            display: { base: options.display ?? 'block' },
            padding: { base: options.padding ?? '0' }
        },
        layoutStyle: {
            ...layoutStyle,
            gap: { base: options.gap ?? '0' }
        }
    };
}

function textNode(
    id: string,
    text: string,
    textKind: TextKind = 'span',
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
): TextNode {
    return {
        id,
        kind: 'text',
        textKind,
        text,
        ...(headingLevel === undefined ? {} : { headingLevel }),
        style: createCommonStyle(),
        typography: createTypographyStyle()
    };
}

function componentNode(
    id: string,
    family: CatalogFamily,
    props: JsonObject = {},
    slots: Readonly<Record<string, readonly string[]>> = {}
): ComponentNode {
    const definition = getCatalogDefinition(family);

    return {
        id,
        kind: 'component',
        family,
        template: 'default',
        adapterId: definition.adapter.id,
        adapterVersion: definition.adapter.version,
        props,
        slots,
        style: createCommonStyle()
    };
}

const nodes: DesignDocument['nodes'] = {
    'page-root': {
        ...layoutNode('page-root', 'page', ['site-header', 'page-main']),
        style: {
            ...createCommonStyle(),
            minHeight: { base: 'screen' },
            surface: { base: 'background' }
        }
    },
    'site-header': {
        ...layoutNode('site-header', 'header', ['header-container']),
        label: 'Product header',
        style: {
            ...createCommonStyle(),
            border: { base: 'default' }
        }
    },
    'header-container': {
        ...layoutNode('header-container', 'row', ['brand-heading', 'status-badge'], {
            display: 'flex',
            gap: '4',
            padding: '4'
        }),
        style: {
            ...createCommonStyle(),
            display: { base: 'flex' },
            width: { base: 'full' },
            maxWidth: { base: 'xl', lg: '2xl' },
            padding: { base: '4', md: '6' }
        },
        layoutStyle: {
            ...createLayoutStyle(),
            direction: { base: 'column', md: 'row' },
            gap: { base: '2', md: '4' },
            align: { base: 'start', md: 'center' },
            justify: { base: 'start', md: 'between' }
        }
    },
    'brand-heading': {
        ...textNode('brand-heading', 'Workspace settings', 'heading', 1),
        typography: {
            ...createTypographyStyle(),
            size: { base: '2xl', md: '3xl' },
            weight: { base: 'semibold' },
            leading: { base: 'tight' }
        }
    },
    'status-badge': componentNode(
        'status-badge',
        'badge',
        { variant: 'success', dot: true },
        { content: ['status-badge-text'] }
    ),
    'status-badge-text': textNode('status-badge-text', 'Local draft'),
    'page-main': layoutNode('page-main', 'main', ['main-container'], {
        display: 'block',
        padding: '4'
    }),
    'main-container': {
        ...layoutNode('main-container', 'stack', ['intro-alert', 'settings-card'], {
            display: 'flex',
            gap: '6'
        }),
        style: {
            ...createCommonStyle(),
            display: { base: 'flex' },
            width: { base: 'full' },
            maxWidth: { base: 'xl', lg: '2xl' }
        },
        layoutStyle: {
            ...createLayoutStyle(),
            gap: { base: '4', md: '6' }
        }
    },
    'intro-alert': componentNode(
        'intro-alert',
        'alert',
        { variant: 'info' },
        {
            title: ['intro-alert-title'],
            description: ['intro-alert-description']
        }
    ),
    'intro-alert-title': textNode('intro-alert-title', 'Saved locally'),
    'intro-alert-description': textNode(
        'intro-alert-description',
        'Changes stay in this browser until you export the project.'
    ),
    'settings-card': componentNode(
        'settings-card',
        'card',
        { variant: 'default' },
        {
            title: ['settings-card-title'],
            description: ['settings-card-description'],
            content: ['settings-content'],
            footer: ['save-button']
        }
    ),
    'settings-card-title': textNode('settings-card-title', 'Profile defaults'),
    'settings-card-description': textNode(
        'settings-card-description',
        'A representative composition using every supported catalog family.'
    ),
    'settings-content': {
        ...layoutNode(
            'settings-content',
            'grid',
            [
                'profile-avatar',
                'email-label',
                'email-input',
                'updates-checkbox',
                'presence-switch',
                'bio-textarea',
                'completion-progress',
                'loading-skeleton'
            ],
            { display: 'grid', gap: '4' }
        ),
        style: {
            ...createCommonStyle(),
            display: { base: 'grid' },
            width: { base: 'full' }
        },
        layoutStyle: {
            ...createLayoutStyle(),
            columns: { base: '1', md: '2' },
            gap: { base: '4', lg: '6' }
        }
    },
    'profile-avatar': componentNode('profile-avatar', 'avatar', {
        size: 'lg',
        shape: 'circle',
        fallback: 'AL'
    }),
    'email-label': componentNode(
        'email-label',
        'label',
        { htmlFor: 'sample-email' },
        { content: ['email-label-text'] }
    ),
    'email-label-text': textNode('email-label-text', 'Contact email'),
    'email-input': componentNode('email-input', 'input', {
        id: 'sample-email',
        label: 'Email',
        type: 'email',
        placeholder: 'alex@example.com',
        variant: 'outline',
        value: '',
        required: true
    }),
    'updates-checkbox': componentNode('updates-checkbox', 'checkbox', {
        checked: true,
        label: 'Product updates',
        description: 'Receive occasional release notes.',
        variant: 'primary'
    }),
    'presence-switch': componentNode('presence-switch', 'switch', {
        switched: false,
        label: 'Share presence',
        description: 'Show when this workspace is open.'
    }),
    'bio-textarea': componentNode('bio-textarea', 'textarea', {
        label: 'Bio',
        placeholder: 'A short introduction',
        variant: 'outline',
        autoresize: true,
        value: '',
        rows: 4
    }),
    'completion-progress': componentNode('completion-progress', 'progress', {
        value: 72,
        max: 100,
        indeterminate: false,
        label: 'Profile completion'
    }),
    'loading-skeleton': componentNode('loading-skeleton', 'skeleton', {
        width: 240,
        height: 16,
        unit: 'px'
    }),
    'save-button': componentNode(
        'save-button',
        'button',
        { variant: 'primary', size: 'md', status: 'idle' },
        { content: ['save-button-text'] }
    ),
    'save-button-text': textNode('save-button-text', 'Save changes')
};

const sampleDocument = {
    format: DESIGN_DOCUMENT_FORMAT,
    schemaVersion: DESIGN_DOCUMENT_SCHEMA_VERSION,
    id: 'sample-project',
    name: 'Sample workspace settings',
    compatibility: {
        catalogVersion: CATALOG_VERSION,
        sivirPackageVersion: '0.2.1',
        generatorVersion: '1.0.0'
    },
    appearance: {
        theme: { ...DEFAULT_THEME },
        colorMode: 'light'
    },
    pages: [
        {
            id: 'settings-page',
            name: 'Workspace settings',
            route: '/settings',
            rootNodeId: 'page-root'
        }
    ],
    nodes
} satisfies DesignDocument;

export const SAMPLE_DOCUMENT = parseDesignDocument(sampleDocument);

const blankDocument = {
    format: DESIGN_DOCUMENT_FORMAT,
    schemaVersion: DESIGN_DOCUMENT_SCHEMA_VERSION,
    id: 'untitled-design-v2',
    name: 'Untitled',
    compatibility: {
        catalogVersion: CATALOG_VERSION,
        sivirPackageVersion: '0.2.1',
        generatorVersion: '1.0.0'
    },
    appearance: {
        theme: { ...DEFAULT_THEME },
        colorMode: 'light'
    },
    pages: [
        {
            id: 'page-1',
            name: 'Page 1',
            route: '/',
            rootNodeId: 'blank-page-root'
        }
    ],
    nodes: {
        'blank-page-root': {
            ...layoutNode('blank-page-root', 'page', []),
            style: {
                ...createCommonStyle(),
                minHeight: { base: 'screen' },
                surface: { base: 'background' }
            }
        }
    }
} satisfies DesignDocument;

export const BLANK_DOCUMENT = parseDesignDocument(blankDocument);
