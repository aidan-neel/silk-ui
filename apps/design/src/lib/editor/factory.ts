import { getCatalogDefinition } from '../catalog/catalog';
import { materializeComponentProps } from '../catalog/props';
import type { CatalogFamily } from '../catalog/types';
import { createCommonStyle, createLayoutStyle, createTypographyStyle } from '../document/defaults';
import type {
    ComponentNode,
    DesignNode,
    JsonObject,
    LayoutKind,
    LayoutNode,
    TextKind,
    TextNode
} from '../document/types';

export type InsertionTemplate = {
    readonly rootNodeId: string;
    readonly nodes: Readonly<Record<string, DesignNode>>;
};

function safeId(value: string): string {
    return value.replaceAll(/[^A-Za-z0-9._:-]/g, '-');
}

function textNode(id: string, text: string, textKind: TextKind = 'span'): TextNode {
    return {
        id,
        kind: 'text',
        textKind,
        text,
        style: createCommonStyle(),
        typography: createTypographyStyle()
    };
}

export function createTextTemplate(id: string, textKind: TextKind): InsertionTemplate {
    const nodeId = safeId(id);
    const heading = textKind === 'heading';
    const node: TextNode = {
        ...textNode(nodeId, heading ? 'Section heading' : 'Write something useful', textKind),
        ...(heading ? { headingLevel: 2 as const } : {}),
        typography: {
            ...createTypographyStyle(),
            size: { base: heading ? 'xl' : 'base' },
            weight: { base: heading ? 'semibold' : 'normal' }
        }
    };

    return { rootNodeId: nodeId, nodes: { [nodeId]: node } };
}

export function createLayoutTemplate(id: string, layout: LayoutKind): InsertionTemplate {
    const nodeId = safeId(id);
    const node: LayoutNode = {
        id: nodeId,
        kind: 'layout',
        layout,
        label: layout === 'section' ? 'Content section' : undefined,
        children: [],
        style: {
            ...createCommonStyle(),
            display: { base: layout === 'grid' ? 'grid' : 'flex' },
            width: { base: 'full' },
            padding: { base: layout === 'section' ? '6' : '0' }
        },
        layoutStyle: {
            ...createLayoutStyle(),
            direction: { base: layout === 'row' ? 'row' : 'column' },
            columns: { base: '1', md: layout === 'grid' ? '2' : '1' },
            gap: { base: '4' },
            wrap: { base: layout === 'row' ? 'wrap' : 'nowrap' }
        }
    };

    return { rootNodeId: nodeId, nodes: { [nodeId]: node } };
}

function initialProps(family: CatalogFamily, suffix: string): JsonObject {
    const props = materializeComponentProps(family, {});

    if (family === 'label') {
        return { ...props, htmlFor: `control-${suffix}` };
    }

    return props;
}

export function createComponentTemplate(family: CatalogFamily, id: string): InsertionTemplate {
    const rootNodeId = safeId(id);
    const definition = getCatalogDefinition(family);
    const nodes: Record<string, DesignNode> = {};
    const slots: Record<string, readonly string[]> = {};
    const requiredText = new Map<string, string>([
        ['alert:title', 'Helpful notice'],
        ['badge:content', 'Status'],
        ['button:content', 'Continue'],
        ['card:title', 'Card title'],
        ['label:content', 'Field label']
    ]);
    const fitWidth = ['avatar', 'badge', 'button', 'checkbox', 'label', 'switch'].includes(family);

    for (const slot of definition.slots) {
        const text = requiredText.get(`${family}:${slot.id}`);

        if (text) {
            const childId = `${rootNodeId}-${slot.id}`;
            nodes[childId] = textNode(childId, text);
            slots[slot.id] = [childId];
        } else {
            slots[slot.id] = [];
        }
    }

    const component: ComponentNode = {
        id: rootNodeId,
        kind: 'component',
        family,
        template: 'default',
        adapterId: definition.adapter.id,
        adapterVersion: definition.adapter.version,
        props: initialProps(family, rootNodeId),
        slots,
        style: {
            ...createCommonStyle(),
            width: { base: fitWidth ? 'fit' : 'full' }
        }
    };
    nodes[rootNodeId] = component;

    return { rootNodeId, nodes };
}
