import type { CatalogDefinition, CatalogFamily } from './types';

export const CATALOG_VERSION = '1.0.0' as const;

const contentSlot = {
    id: 'content',
    label: 'Content',
    minChildren: 1,
    maxChildren: 50,
    allowedNodeKinds: ['layout', 'text', 'component'],
    partPath: []
} as const;

function authoring(
    resize: 'none' | 'width' | 'both',
    interaction: 'none' | 'native' | 'controlled' | 'collection'
) {
    return {
        allowedParentKinds: ['layout', 'component'],
        selection: 'root',
        resize,
        interaction,
        portal: 'none'
    } as const;
}

export const COMPONENT_CATALOG = [
    {
        family: 'alert',
        label: 'Alert',
        description: 'A semantic status message with a title and optional description.',
        group: 'feedback',
        status: 'supported',
        authoring: authoring('width', 'none'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Alert',
            style: 'namespace'
        },
        adapter: {
            id: 'sivir.alert',
            version: 1,
            previewId: 'sivir.alert.preview.v1',
            codegenId: 'sivir.alert.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Alert' }],
        parts: [
            { id: 'root', symbol: 'Root', required: true },
            { id: 'title', symbol: 'Title', required: true },
            { id: 'description', symbol: 'Description', required: false }
        ],
        props: [
            {
                name: 'variant',
                target: 'variant',
                label: 'Variant',
                kind: 'enum',
                required: false,
                values: ['info', 'success', 'warning', 'error'],
                defaultValue: 'info'
            }
        ],
        slots: [
            {
                id: 'title',
                label: 'Title',
                minChildren: 1,
                maxChildren: 1,
                allowedNodeKinds: ['text'],
                partPath: ['Title']
            },
            {
                id: 'description',
                label: 'Description',
                minChildren: 0,
                maxChildren: 1,
                allowedNodeKinds: ['text'],
                partPath: ['Description']
            }
        ]
    },
    {
        family: 'avatar',
        label: 'Avatar',
        description: 'An image with a textual fallback, finite size, and finite shape.',
        group: 'content',
        status: 'supported',
        authoring: authoring('none', 'none'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Avatar',
            style: 'namespace'
        },
        adapter: {
            id: 'sivir.avatar',
            version: 1,
            previewId: 'sivir.avatar.preview.v1',
            codegenId: 'sivir.avatar.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Avatar' }],
        parts: [
            { id: 'root', symbol: 'Root', required: true },
            { id: 'image', symbol: 'Image', required: false },
            { id: 'fallback', symbol: 'Fallback', required: true }
        ],
        props: [
            {
                name: 'size',
                target: 'size',
                label: 'Size',
                kind: 'enum',
                required: false,
                values: ['sm', 'md', 'lg', 'xl'],
                defaultValue: 'md'
            },
            {
                name: 'shape',
                target: 'shape',
                label: 'Shape',
                kind: 'enum',
                required: false,
                values: ['circle', 'square'],
                defaultValue: 'circle'
            },
            {
                name: 'src',
                target: 'src',
                label: 'Image URL',
                kind: 'string',
                format: 'url',
                required: false,
                minLength: 1,
                maxLength: 2048
            },
            {
                name: 'alt',
                target: 'alt',
                label: 'Alternative text',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 0,
                maxLength: 500,
                defaultValue: ''
            },
            {
                name: 'fallback',
                target: 'fallback',
                label: 'Fallback',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 12,
                defaultValue: 'A'
            }
        ],
        slots: []
    },
    {
        family: 'badge',
        label: 'Badge',
        description: 'A compact status or category label.',
        group: 'content',
        status: 'supported',
        authoring: authoring('none', 'native'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Badge',
            style: 'named'
        },
        adapter: {
            id: 'sivir.badge',
            version: 1,
            previewId: 'sivir.badge.preview.v1',
            codegenId: 'sivir.badge.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Badge' }],
        parts: [{ id: 'root', symbol: 'Badge', required: true }],
        props: [
            {
                name: 'variant',
                target: 'variant',
                label: 'Variant',
                kind: 'enum',
                required: false,
                values: [
                    'primary',
                    'secondary',
                    'ghost',
                    'outline',
                    'destructive',
                    'info',
                    'success',
                    'warning',
                    'error'
                ],
                defaultValue: 'secondary'
            },
            {
                name: 'dot',
                target: 'dot',
                label: 'Show dot',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'href',
                target: 'href',
                label: 'Link',
                kind: 'string',
                format: 'url',
                required: false,
                minLength: 1,
                maxLength: 2048
            }
        ],
        slots: [contentSlot]
    },
    {
        family: 'button',
        label: 'Button',
        description: 'A button or safe link with a finite visual and status state.',
        group: 'forms',
        status: 'supported',
        authoring: authoring('none', 'native'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Button',
            style: 'named'
        },
        adapter: {
            id: 'sivir.button',
            version: 1,
            previewId: 'sivir.button.preview.v1',
            codegenId: 'sivir.button.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Button' }],
        parts: [{ id: 'root', symbol: 'Button', required: true }],
        props: [
            {
                name: 'variant',
                target: 'variant',
                label: 'Variant',
                kind: 'enum',
                required: false,
                values: [
                    'primary',
                    'secondary',
                    'ghost',
                    'quiet',
                    'outline',
                    'destructive',
                    'panel'
                ],
                defaultValue: 'primary'
            },
            {
                name: 'size',
                target: 'size',
                label: 'Size',
                kind: 'enum',
                required: false,
                values: ['sm', 'md', 'lg', 'icon'],
                defaultValue: 'md'
            },
            {
                name: 'status',
                target: 'status',
                label: 'Status',
                kind: 'enum',
                required: false,
                values: ['idle', 'loading', 'success', 'error'],
                defaultValue: 'idle'
            },
            {
                name: 'href',
                target: 'href',
                label: 'Link',
                kind: 'string',
                format: 'url',
                required: false,
                minLength: 1,
                maxLength: 2048
            },
            {
                name: 'disabled',
                target: 'disabled',
                label: 'Disabled',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'ariaLabel',
                target: 'aria-label',
                label: 'Accessible label',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 500
            }
        ],
        slots: [contentSlot]
    },
    {
        family: 'card',
        label: 'Card',
        description: 'A structured surface with header, content, and footer parts.',
        group: 'content',
        status: 'supported',
        authoring: authoring('width', 'none'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Card',
            style: 'namespace'
        },
        adapter: {
            id: 'sivir.card',
            version: 1,
            previewId: 'sivir.card.preview.v1',
            codegenId: 'sivir.card.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Card' }],
        parts: [
            { id: 'root', symbol: 'Root', required: true },
            { id: 'header', symbol: 'Header', required: true },
            { id: 'title', symbol: 'Title', required: true },
            { id: 'description', symbol: 'Description', required: false },
            { id: 'content', symbol: 'Content', required: false },
            { id: 'footer', symbol: 'Footer', required: false }
        ],
        props: [
            {
                name: 'variant',
                target: 'variant',
                label: 'Variant',
                kind: 'enum',
                required: false,
                values: ['default', 'panel'],
                defaultValue: 'default'
            }
        ],
        slots: [
            {
                id: 'title',
                label: 'Title',
                minChildren: 1,
                maxChildren: 1,
                allowedNodeKinds: ['text'],
                partPath: ['Header', 'Title']
            },
            {
                id: 'description',
                label: 'Description',
                minChildren: 0,
                maxChildren: 1,
                allowedNodeKinds: ['text'],
                partPath: ['Header', 'Description']
            },
            {
                id: 'content',
                label: 'Content',
                minChildren: 0,
                maxChildren: 50,
                allowedNodeKinds: ['layout', 'text', 'component'],
                partPath: ['Content']
            },
            {
                id: 'footer',
                label: 'Footer',
                minChildren: 0,
                maxChildren: 10,
                allowedNodeKinds: ['layout', 'text', 'component'],
                partPath: ['Footer']
            }
        ]
    },
    {
        family: 'checkbox',
        label: 'Checkbox',
        description: 'A labeled binary input with an optional description.',
        group: 'forms',
        status: 'supported',
        authoring: authoring('none', 'controlled'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Checkbox',
            style: 'named'
        },
        adapter: {
            id: 'sivir.checkbox',
            version: 1,
            previewId: 'sivir.checkbox.preview.v1',
            codegenId: 'sivir.checkbox.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Checkbox' }],
        parts: [{ id: 'root', symbol: 'Checkbox', required: true }],
        props: [
            {
                name: 'checked',
                target: 'checked',
                label: 'Checked',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'label',
                target: 'label',
                label: 'Label',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 500,
                defaultValue: 'Option'
            },
            {
                name: 'description',
                target: 'description',
                label: 'Description',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 2000
            },
            {
                name: 'disabled',
                target: 'disabled',
                label: 'Disabled',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'variant',
                target: 'variant',
                label: 'Variant',
                kind: 'enum',
                required: false,
                values: ['default', 'primary'],
                defaultValue: 'default'
            }
        ],
        slots: []
    },
    {
        family: 'input',
        label: 'Input',
        description: 'A labeled native input restricted to serializable initial state.',
        group: 'forms',
        status: 'supported',
        authoring: authoring('width', 'native'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Input',
            style: 'named'
        },
        adapter: {
            id: 'sivir.input',
            version: 1,
            previewId: 'sivir.input.preview.v1',
            codegenId: 'sivir.input.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Input' }],
        parts: [{ id: 'root', symbol: 'Input', required: true }],
        props: [
            {
                name: 'id',
                target: 'id',
                label: 'Control ID',
                kind: 'string',
                format: 'id',
                required: false,
                minLength: 1,
                maxLength: 128
            },
            {
                name: 'label',
                target: 'label',
                label: 'Label',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 500,
                defaultValue: 'Field'
            },
            {
                name: 'description',
                target: 'description',
                label: 'Description',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 2000
            },
            {
                name: 'placeholder',
                target: 'placeholder',
                label: 'Placeholder',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 0,
                maxLength: 500,
                defaultValue: ''
            },
            {
                name: 'type',
                target: 'type',
                label: 'Type',
                kind: 'enum',
                required: false,
                values: ['text', 'email', 'password', 'search', 'url', 'tel', 'number', 'date'],
                defaultValue: 'text'
            },
            {
                name: 'variant',
                target: 'variant',
                label: 'Variant',
                kind: 'enum',
                required: false,
                values: ['outline', 'secondary'],
                defaultValue: 'outline'
            },
            {
                name: 'value',
                target: 'value',
                label: 'Initial value',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 0,
                maxLength: 10000,
                defaultValue: ''
            },
            {
                name: 'disabled',
                target: 'disabled',
                label: 'Disabled',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'required',
                target: 'required',
                label: 'Required',
                kind: 'boolean',
                required: false,
                defaultValue: false
            }
        ],
        slots: []
    },
    {
        family: 'label',
        label: 'Label',
        description: 'A semantic label for a known control ID.',
        group: 'forms',
        status: 'supported',
        authoring: authoring('none', 'none'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Label',
            style: 'named'
        },
        adapter: {
            id: 'sivir.label',
            version: 1,
            previewId: 'sivir.label.preview.v1',
            codegenId: 'sivir.label.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Label' }],
        parts: [{ id: 'root', symbol: 'Label', required: true }],
        props: [
            {
                name: 'htmlFor',
                target: 'for',
                label: 'Control ID',
                kind: 'string',
                format: 'id',
                required: true,
                minLength: 1,
                maxLength: 128
            }
        ],
        slots: [contentSlot]
    },
    {
        family: 'progress',
        label: 'Progress',
        description: 'A bounded determinate or indeterminate progress indicator.',
        group: 'feedback',
        status: 'supported',
        authoring: authoring('width', 'none'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Progress',
            style: 'named'
        },
        adapter: {
            id: 'sivir.progress',
            version: 1,
            previewId: 'sivir.progress.preview.v1',
            codegenId: 'sivir.progress.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Progress' }],
        parts: [{ id: 'root', symbol: 'Progress', required: true }],
        props: [
            {
                name: 'value',
                target: 'value',
                label: 'Value',
                kind: 'number',
                required: false,
                min: 0,
                max: 1000000,
                step: 1,
                integer: false,
                defaultValue: 50
            },
            {
                name: 'max',
                target: 'max',
                label: 'Maximum',
                kind: 'number',
                required: false,
                min: 1,
                max: 1000000,
                step: 1,
                integer: false,
                defaultValue: 100
            },
            {
                name: 'indeterminate',
                target: 'indeterminate',
                label: 'Indeterminate',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'label',
                target: 'aria-label',
                label: 'Accessible label',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 500,
                defaultValue: 'Progress'
            }
        ],
        slots: []
    },
    {
        family: 'skeleton',
        label: 'Skeleton',
        description: 'A bounded rectangular loading placeholder.',
        group: 'feedback',
        status: 'supported',
        authoring: authoring('both', 'none'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Skeleton',
            style: 'named'
        },
        adapter: {
            id: 'sivir.skeleton',
            version: 1,
            previewId: 'sivir.skeleton.preview.v1',
            codegenId: 'sivir.skeleton.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Skeleton' }],
        parts: [{ id: 'root', symbol: 'Skeleton', required: true }],
        props: [
            {
                name: 'width',
                target: 'w',
                label: 'Width',
                kind: 'number',
                required: false,
                min: 1,
                max: 4096,
                step: 1,
                integer: false,
                defaultValue: 240
            },
            {
                name: 'height',
                target: 'h',
                label: 'Height',
                kind: 'number',
                required: false,
                min: 1,
                max: 4096,
                step: 1,
                integer: false,
                defaultValue: 16
            },
            {
                name: 'unit',
                target: 'unit',
                label: 'Unit',
                kind: 'enum',
                required: false,
                values: ['px', 'rem', 'em', '%', 'vh', 'vw', 'ch'],
                defaultValue: 'px'
            }
        ],
        slots: []
    },
    {
        family: 'switch',
        label: 'Switch',
        description: 'A labeled binary switch with serializable initial state.',
        group: 'forms',
        status: 'supported',
        authoring: authoring('none', 'controlled'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Switch',
            style: 'named'
        },
        adapter: {
            id: 'sivir.switch',
            version: 1,
            previewId: 'sivir.switch.preview.v1',
            codegenId: 'sivir.switch.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Switch' }],
        parts: [{ id: 'root', symbol: 'Switch', required: true }],
        props: [
            {
                name: 'switched',
                target: 'switched',
                label: 'Switched on',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'label',
                target: 'label',
                label: 'Label',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 500,
                defaultValue: 'Setting'
            },
            {
                name: 'description',
                target: 'description',
                label: 'Description',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 2000
            },
            {
                name: 'disabled',
                target: 'disabled',
                label: 'Disabled',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'ariaLabel',
                target: 'aria-label',
                label: 'Accessible label',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 500
            }
        ],
        slots: []
    },
    {
        family: 'textarea',
        label: 'Textarea',
        description: 'A multiline field with safe initial content and finite presentation props.',
        group: 'forms',
        status: 'supported',
        authoring: authoring('width', 'native'),
        packageImport: {
            source: '@sivir-ui/svelte',
            symbol: 'Textarea',
            style: 'named'
        },
        adapter: {
            id: 'sivir.textarea',
            version: 1,
            previewId: 'sivir.textarea.preview.v1',
            codegenId: 'sivir.textarea.codegen.v1',
            migrations: []
        },
        templates: [{ id: 'default', label: 'Textarea' }],
        parts: [{ id: 'root', symbol: 'Textarea', required: true }],
        props: [
            {
                name: 'label',
                target: 'label',
                label: 'Label',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 500,
                defaultValue: 'Message'
            },
            {
                name: 'description',
                target: 'description',
                label: 'Description',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 1,
                maxLength: 2000
            },
            {
                name: 'placeholder',
                target: 'placeholder',
                label: 'Placeholder',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 0,
                maxLength: 500,
                defaultValue: ''
            },
            {
                name: 'variant',
                target: 'variant',
                label: 'Variant',
                kind: 'enum',
                required: false,
                values: ['outline', 'secondary'],
                defaultValue: 'outline'
            },
            {
                name: 'autoresize',
                target: 'autoresize',
                label: 'Auto resize',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'value',
                target: 'value',
                label: 'Initial value',
                kind: 'string',
                format: 'text',
                required: false,
                minLength: 0,
                maxLength: 10000,
                defaultValue: ''
            },
            {
                name: 'rows',
                target: 'rows',
                label: 'Rows',
                kind: 'number',
                required: false,
                min: 2,
                max: 12,
                step: 1,
                integer: true,
                defaultValue: 4
            },
            {
                name: 'disabled',
                target: 'disabled',
                label: 'Disabled',
                kind: 'boolean',
                required: false,
                defaultValue: false
            },
            {
                name: 'required',
                target: 'required',
                label: 'Required',
                kind: 'boolean',
                required: false,
                defaultValue: false
            }
        ],
        slots: []
    }
] as const satisfies readonly CatalogDefinition[];

const CATALOG_BY_FAMILY = new Map<CatalogFamily, CatalogDefinition>(
    COMPONENT_CATALOG.map((definition) => [definition.family, definition])
);

export function getCatalogDefinition(family: CatalogFamily): CatalogDefinition {
    const definition = CATALOG_BY_FAMILY.get(family);

    if (!definition) {
        throw new TypeError(`Unknown catalog family: ${family}.`);
    }

    return definition;
}

export function findCatalogDefinition(value: string): CatalogDefinition | undefined {
    return CATALOG_BY_FAMILY.get(value as CatalogFamily);
}
