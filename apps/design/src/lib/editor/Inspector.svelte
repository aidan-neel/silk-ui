<script lang="ts">
    import { Badge, Button, Input, Switch, Textarea } from '@sivir-ui/svelte';
    import { getCatalogDefinition, materializeComponentProps } from '../catalog';
    import type { CatalogPropSchema } from '../catalog/types';
    import type { Breakpoint, DesignDocument, DesignNode, JsonValue } from '../document';
    import type { DesignCommand, ResponsiveGroup } from './commands';
    import EditorSelect from './EditorSelect.svelte';

    type Props = {
        document: DesignDocument;
        selectedNodeId: string | null;
        breakpoint: Breakpoint;
        onchange: (command: DesignCommand, transactionId?: string) => void;
    };

    type ResponsiveField = {
        label: string;
        group: ResponsiveGroup;
        property: string;
        options: readonly string[];
    };

    let { document, selectedNodeId, breakpoint, onchange }: Props = $props();

    const selectedNode = $derived(selectedNodeId ? document.nodes[selectedNodeId] : undefined);
    const commonFields: readonly ResponsiveField[] = [
        {
            label: 'Width',
            group: 'style',
            property: 'width',
            options: ['auto', 'full', 'fit']
        },
        {
            label: 'Max width',
            group: 'style',
            property: 'maxWidth',
            options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'screen']
        },
        {
            label: 'Padding',
            group: 'style',
            property: 'padding',
            options: ['0', '1', '2', '3', '4', '6', '8', '12']
        },
        {
            label: 'Surface',
            group: 'style',
            property: 'surface',
            options: ['transparent', 'background', 'card', 'muted', 'primary']
        },
        {
            label: 'Radius',
            group: 'style',
            property: 'radius',
            options: ['none', 'sm', 'md', 'lg', 'xl', 'full']
        }
    ];
    const layoutFields: readonly ResponsiveField[] = [
        {
            label: 'Direction',
            group: 'layoutStyle',
            property: 'direction',
            options: ['row', 'column']
        },
        {
            label: 'Columns',
            group: 'layoutStyle',
            property: 'columns',
            options: ['1', '2', '3', '4', '6', '12']
        },
        {
            label: 'Gap',
            group: 'layoutStyle',
            property: 'gap',
            options: ['0', '1', '2', '3', '4', '6', '8', '12']
        },
        {
            label: 'Align',
            group: 'layoutStyle',
            property: 'align',
            options: ['start', 'center', 'end', 'stretch']
        },
        {
            label: 'Justify',
            group: 'layoutStyle',
            property: 'justify',
            options: ['start', 'center', 'end', 'between']
        }
    ];
    const textFields: readonly ResponsiveField[] = [
        {
            label: 'Size',
            group: 'typography',
            property: 'size',
            options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
        },
        {
            label: 'Weight',
            group: 'typography',
            property: 'weight',
            options: ['normal', 'medium', 'semibold', 'bold']
        },
        {
            label: 'Tone',
            group: 'typography',
            property: 'tone',
            options: ['default', 'muted', 'subtle', 'primary', 'success', 'warning', 'danger']
        },
        {
            label: 'Align',
            group: 'typography',
            property: 'align',
            options: ['left', 'center', 'right']
        }
    ];

    function groupRecord(node: DesignNode, group: ResponsiveGroup): Record<string, unknown> {
        const value = node[group as keyof DesignNode];
        return value && typeof value === 'object' && !Array.isArray(value)
            ? (value as unknown as Record<string, unknown>)
            : {};
    }

    function responsiveRecord(
        node: DesignNode,
        group: ResponsiveGroup,
        property: string
    ): Record<string, string> {
        const value = groupRecord(node, group)[property];
        return value && typeof value === 'object' && !Array.isArray(value)
            ? (value as Record<string, string>)
            : {};
    }

    function resolvedValue(node: DesignNode, field: ResponsiveField): string {
        const responsive = responsiveRecord(node, field.group, field.property);

        if (breakpoint === 'lg') {
            return responsive.lg ?? responsive.md ?? responsive.base ?? field.options[0];
        }

        if (breakpoint === 'md') {
            return responsive.md ?? responsive.base ?? field.options[0];
        }

        return responsive.base ?? field.options[0];
    }

    function isInherited(node: DesignNode, field: ResponsiveField): boolean {
        return (
            breakpoint !== 'base' &&
            !Object.hasOwn(responsiveRecord(node, field.group, field.property), breakpoint)
        );
    }

    function setResponsive(node: DesignNode, field: ResponsiveField, value: string): void {
        onchange({
            type: 'set-responsive-value',
            nodeId: node.id,
            group: field.group,
            property: field.property,
            breakpoint,
            value
        });
    }

    function resetResponsive(node: DesignNode, field: ResponsiveField): void {
        if (breakpoint === 'base') {
            return;
        }

        onchange({
            type: 'remove-responsive-override',
            nodeId: node.id,
            group: field.group,
            property: field.property,
            breakpoint
        });
    }

    function propValue(
        node: Extract<DesignNode, { kind: 'component' }>,
        schema: CatalogPropSchema
    ) {
        return materializeComponentProps(node.family, node.props)[schema.name];
    }

    function setProp(
        node: Extract<DesignNode, { kind: 'component' }>,
        schema: CatalogPropSchema,
        value: JsonValue
    ): void {
        onchange({
            type: 'set-component-prop',
            nodeId: node.id,
            prop: schema.name,
            value
        });
    }
</script>

{#snippet responsiveField(node: DesignNode, field: ResponsiveField)}
    <div class="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-2">
        <div class="flex min-w-0 items-center gap-1">
            <span class="truncate text-xs font-medium text-foreground-muted">{field.label}</span>
            {#if isInherited(node, field)}
                <Button
                    size="sm"
                    variant="quiet"
                    class="h-5 min-h-0 px-1 text-[10px] text-foreground-subtle"
                    onclick={() => setResponsive(node, field, resolvedValue(node, field))}
                >
                    Link
                </Button>
            {:else if breakpoint !== 'base'}
                <Button
                    size="sm"
                    variant="quiet"
                    class="h-5 min-h-0 px-1 text-[10px] text-foreground-subtle"
                    onclick={() => resetResponsive(node, field)}
                >
                    Reset
                </Button>
            {/if}
        </div>
        <EditorSelect
            label={field.label}
            value={resolvedValue(node, field)}
            options={field.options}
            onchange={(value) => setResponsive(node, field, value)}
            class="h-8 min-h-0 text-xs"
        />
    </div>
{/snippet}

{#snippet componentProp(node: Extract<DesignNode, { kind: 'component' }>, schema: CatalogPropSchema)}
    {#if schema.kind === 'boolean'}
        <Switch
            label={schema.label}
            switched={Boolean(propValue(node, schema))}
            onclick={() => setProp(node, schema, !propValue(node, schema))}
        />
    {:else}
        <div class="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-2">
            <label
                class="truncate text-xs font-medium text-foreground-muted"
                for={`${node.id}-prop-${schema.name}`}
            >
                {schema.label}
            </label>
            {#if schema.kind === 'enum'}
                <EditorSelect
                    label={schema.label}
                    value={String(propValue(node, schema) ?? schema.defaultValue)}
                    options={schema.values}
                    onchange={(value) => setProp(node, schema, value)}
                    class="h-8 min-h-0 text-xs"
                />
            {:else if schema.kind === 'number'}
                <Input
                    id={`${node.id}-prop-${schema.name}`}
                    type="number"
                    class="h-8 min-h-0 text-xs"
                    min={schema.min}
                    max={schema.max}
                    step={schema.step}
                    value={Number(propValue(node, schema) ?? schema.defaultValue ?? schema.min)}
                    oninput={(event) => setProp(node, schema, event.currentTarget.valueAsNumber)}
                />
            {:else}
                <Input
                    id={`${node.id}-prop-${schema.name}`}
                    type="text"
                    class="h-8 min-h-0 text-xs"
                    value={String(propValue(node, schema) ?? schema.defaultValue ?? '')}
                    placeholder={schema.required ? undefined : 'Not set'}
                    oninput={(event) => setProp(node, schema, event.currentTarget.value)}
                />
            {/if}
        </div>
    {/if}
{/snippet}

{#if !selectedNode}
    <div class="grid min-h-48 place-items-center px-7 text-center">
        <div class="grid max-w-48 gap-1.5">
            <h2 class="font-semibold">Nothing selected</h2>
            <p class="text-sm text-foreground-muted">
                Select a layer or click an element on the canvas.
            </p>
        </div>
    </div>
{:else}
    <div class="grid gap-4 p-3">
        <header class="flex items-start justify-between gap-3 pb-1">
            <h2 class="min-w-0 truncate font-semibold">
                {selectedNode.kind === 'component'
                    ? getCatalogDefinition(selectedNode.family).label
                    : selectedNode.kind === 'layout'
                      ? selectedNode.label ?? selectedNode.layout
                      : selectedNode.text || 'Empty text'}
            </h2>
            <Badge variant="secondary">{selectedNode.kind}</Badge>
        </header>

        {#if selectedNode.kind === 'text'}
            <section class="grid gap-2 border-t border-border pt-3">
                <h3 class="text-xs font-semibold">Content</h3>
                <Textarea
                    label="Text"
                    class="min-h-20 text-sm"
                    value={selectedNode.text}
                    oninput={(event) =>
                        onchange(
                            {
                                type: 'set-text',
                                nodeId: selectedNode.id,
                                text: event.currentTarget.value
                            },
                            `text-${selectedNode.id}`
                        )}
                />
            </section>
            <section class="grid gap-2 border-t border-border pt-3">
                <h3 class="text-xs font-semibold">Typography</h3>
                {#each textFields as field}
                    {@render responsiveField(selectedNode, field)}
                {/each}
            </section>
        {:else if selectedNode.kind === 'component'}
            <section class="grid gap-2 border-t border-border pt-3">
                <h3 class="text-xs font-semibold">Component</h3>
                {#each getCatalogDefinition(selectedNode.family).props as schema}
                    {@render componentProp(selectedNode, schema)}
                {/each}
            </section>
        {:else}
            <section class="grid gap-2 border-t border-border pt-3">
                <h3 class="text-xs font-semibold">Layout</h3>
                {#each layoutFields as field}
                    {@render responsiveField(selectedNode, field)}
                {/each}
            </section>
        {/if}

        <section class="grid gap-2 border-t border-border pt-3">
            <h3 class="text-xs font-semibold">Box</h3>
            {#each commonFields as field}
                {@render responsiveField(selectedNode, field)}
            {/each}
        </section>
    </div>
{/if}
