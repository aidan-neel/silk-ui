<script lang="ts">
    import {
        Alert,
        Avatar,
        Badge,
        Button,
        Card,
        Checkbox,
        Input,
        Label,
        Progress,
        Skeleton,
        Switch,
        Textarea
    } from '@sivir-ui/svelte';
    import type { ProgressProps } from '@sivir-ui/svelte/components/progress';
    import type { Component } from 'svelte';
    import { materializeComponentProps } from '../catalog/props';
    import type {
        ComponentNode,
        DesignDocument,
        DesignNode,
        LayoutNode,
        TextNode
    } from '../document';
    import { nodeClassNames } from '../layout';
    import type { PreviewMode } from './protocol';

    type Props = {
        document: DesignDocument;
        pageId: string;
        selectedNodeId: string | null;
        mode: PreviewMode;
        onselect?: (nodeId: string) => void;
    };

    type NodeIds = readonly string[];

    let { document, pageId, selectedNodeId, mode, onselect }: Props = $props();

    type LabeledProgressProps = ProgressProps & {
        'aria-label'?: string;
        'data-sd-node-id'?: string;
    };

    const LabeledProgress = Progress as Component<LabeledProgressProps>;

    const page = $derived(
        document.pages.find((candidate) => candidate.id === pageId) ?? document.pages[0]
    );

    function layoutTag(
        node: LayoutNode
    ): 'div' | 'section' | 'header' | 'main' | 'nav' | 'aside' | 'footer' {
        switch (node.layout) {
            case 'section':
                return 'section';
            case 'header':
                return 'header';
            case 'main':
                return 'main';
            case 'navigation':
                return 'nav';
            case 'aside':
                return 'aside';
            case 'footer':
                return 'footer';
            default:
                return 'div';
        }
    }

    function textTag(node: TextNode): string {
        if (node.textKind === 'heading') {
            return `h${node.headingLevel ?? 2}`;
        }

        return node.textKind === 'paragraph' ? 'p' : node.textKind;
    }

    function classes(node: DesignNode): string {
        return [
            ...nodeClassNames(node),
            selectedNodeId === node.id && mode === 'select'
                ? 'outline-2 outline-offset-2 outline-primary'
                : ''
        ]
            .filter(Boolean)
            .join(' ');
    }

    function componentProps(node: ComponentNode) {
        return materializeComponentProps(node.family, node.props);
    }

    function stringProp(node: ComponentNode, key: string, fallback = ''): string {
        const value = componentProps(node)[key];
        return typeof value === 'string' ? value : fallback;
    }

    function booleanProp(node: ComponentNode, key: string, fallback = false): boolean {
        const value = componentProps(node)[key];
        return typeof value === 'boolean' ? value : fallback;
    }

    function numberProp(node: ComponentNode, key: string, fallback: number): number {
        const value = componentProps(node)[key];
        return typeof value === 'number' ? value : fallback;
    }

    function enumProp<const T extends readonly string[]>(
        node: ComponentNode,
        key: string,
        values: T,
        fallback: T[number]
    ): T[number] {
        const value = stringProp(node, key, fallback);
        return values.includes(value) ? value : fallback;
    }

    function handleCapture(event: MouseEvent): void {
        if (mode !== 'select') {
            return;
        }

        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const authored = target.closest<HTMLElement>('[data-sd-node-id]');

        if (!authored?.dataset.sdNodeId) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        onselect?.(authored.dataset.sdNodeId);
    }
</script>

{#snippet children(ids: NodeIds)}
    {#each ids as childId (childId)}
        {@render renderNode(childId)}
    {/each}
{/snippet}

{#snippet component(node: ComponentNode)}
    {@const nodeClasses = classes(node)}
    {#if node.family === 'alert'}
        <div class="contents" data-sd-node-id={node.id}>
            <Alert.Root
                variant={enumProp(
                    node,
                    'variant',
                    ['info', 'success', 'warning', 'error'],
                    'info'
                )}
                class={nodeClasses}
            >
                <Alert.Title>{@render children(node.slots.title ?? [])}</Alert.Title>
                {#if (node.slots.description ?? []).length > 0}
                    <Alert.Description>
                        {@render children(node.slots.description ?? [])}
                    </Alert.Description>
                {/if}
            </Alert.Root>
        </div>
    {:else if node.family === 'avatar'}
        <Avatar.Root
            data-sd-node-id={node.id}
            size={enumProp(node, 'size', ['sm', 'md', 'lg', 'xl'], 'md')}
            shape={enumProp(node, 'shape', ['circle', 'square'], 'circle')}
            class={nodeClasses}
        >
            {#if stringProp(node, 'src')}
                <Avatar.Image src={stringProp(node, 'src')} alt={stringProp(node, 'alt')} />
            {/if}
            <Avatar.Fallback>{stringProp(node, 'fallback', 'A')}</Avatar.Fallback>
        </Avatar.Root>
    {:else if node.family === 'badge'}
        <Badge
            data-sd-node-id={node.id}
            variant={enumProp(
                node,
                'variant',
                [
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
                'secondary'
            )}
            dot={booleanProp(node, 'dot')}
            href={stringProp(node, 'href') || undefined}
            class={nodeClasses}
        >
            {@render children(node.slots.content ?? [])}
        </Badge>
    {:else if node.family === 'button'}
        <Button
            data-sd-node-id={node.id}
            variant={enumProp(
                node,
                'variant',
                ['primary', 'secondary', 'ghost', 'quiet', 'outline', 'destructive', 'panel'],
                'primary'
            )}
            size={enumProp(node, 'size', ['sm', 'md', 'lg', 'icon'], 'md')}
            status={enumProp(node, 'status', ['idle', 'loading', 'success', 'error'], 'idle')}
            href={stringProp(node, 'href') || undefined}
            disabled={booleanProp(node, 'disabled')}
            aria-label={stringProp(node, 'ariaLabel') || undefined}
            class={nodeClasses}
        >
            {@render children(node.slots.content ?? [])}
        </Button>
    {:else if node.family === 'card'}
        <div class="contents" data-sd-node-id={node.id}>
            <Card.Root
                variant={enumProp(node, 'variant', ['default', 'panel'], 'default')}
                class={nodeClasses}
            >
                <Card.Header>
                    <Card.Title>{@render children(node.slots.title ?? [])}</Card.Title>
                    {#if (node.slots.description ?? []).length > 0}
                        <Card.Description>
                            {@render children(node.slots.description ?? [])}
                        </Card.Description>
                    {/if}
                </Card.Header>
                {#if (node.slots.content ?? []).length > 0}
                    <Card.Content>{@render children(node.slots.content ?? [])}</Card.Content>
                {/if}
                {#if (node.slots.footer ?? []).length > 0}
                    <Card.Footer>{@render children(node.slots.footer ?? [])}</Card.Footer>
                {/if}
            </Card.Root>
        </div>
    {:else if node.family === 'checkbox'}
        <div class="contents" data-sd-node-id={node.id}>
            <Checkbox
                checked={booleanProp(node, 'checked')}
                label={stringProp(node, 'label', 'Option')}
                description={stringProp(node, 'description') || undefined}
                disabled={booleanProp(node, 'disabled')}
                variant={enumProp(node, 'variant', ['default', 'primary'], 'default')}
                class={nodeClasses}
            />
        </div>
    {:else if node.family === 'input'}
        <Input
            data-sd-node-id={node.id}
            id={stringProp(node, 'id') || undefined}
            label={stringProp(node, 'label', 'Field')}
            description={stringProp(node, 'description') || undefined}
            placeholder={stringProp(node, 'placeholder')}
            type={enumProp(
                node,
                'type',
                ['text', 'email', 'password', 'search', 'url', 'tel', 'number', 'date'],
                'text'
            )}
            variant={enumProp(node, 'variant', ['outline', 'secondary'], 'outline')}
            value={stringProp(node, 'value')}
            disabled={booleanProp(node, 'disabled')}
            required={booleanProp(node, 'required')}
            class={nodeClasses}
        />
    {:else if node.family === 'label'}
        <Label data-sd-node-id={node.id} for={stringProp(node, 'htmlFor')} class={nodeClasses}>
            {@render children(node.slots.content ?? [])}
        </Label>
    {:else if node.family === 'progress'}
        <LabeledProgress
            data-sd-node-id={node.id}
            value={numberProp(node, 'value', 50)}
            max={numberProp(node, 'max', 100)}
            indeterminate={booleanProp(node, 'indeterminate')}
            aria-label={stringProp(node, 'label', 'Progress')}
            class={nodeClasses}
        />
    {:else if node.family === 'skeleton'}
        <div class="contents" data-sd-node-id={node.id}>
            <Skeleton
                w={numberProp(node, 'width', 240)}
                h={numberProp(node, 'height', 16)}
                unit={enumProp(
                    node,
                    'unit',
                    ['px', 'rem', 'em', '%', 'vh', 'vw', 'ch'],
                    'px'
                )}
                class={nodeClasses}
            />
        </div>
    {:else if node.family === 'switch'}
        <Switch
            data-sd-node-id={node.id}
            switched={booleanProp(node, 'switched')}
            label={stringProp(node, 'label', 'Setting')}
            description={stringProp(node, 'description') || undefined}
            disabled={booleanProp(node, 'disabled')}
            aria-label={stringProp(node, 'ariaLabel') || undefined}
            class={nodeClasses}
        />
    {:else if node.family === 'textarea'}
        <Textarea
            data-sd-node-id={node.id}
            label={stringProp(node, 'label', 'Message')}
            description={stringProp(node, 'description') || undefined}
            placeholder={stringProp(node, 'placeholder')}
            variant={enumProp(node, 'variant', ['outline', 'secondary'], 'outline')}
            autoresize={booleanProp(node, 'autoresize')}
            value={stringProp(node, 'value')}
            rows={numberProp(node, 'rows', 4)}
            disabled={booleanProp(node, 'disabled')}
            required={booleanProp(node, 'required')}
            class={nodeClasses}
        />
    {/if}
{/snippet}

{#snippet renderNode(nodeId: string)}
    {@const node = document.nodes[nodeId]}
    {#if node?.kind === 'layout'}
        <svelte:element
            this={layoutTag(node)}
            data-sd-node-id={node.id}
            aria-label={node.label}
            class={classes(node)}
        >
            {@render children(node.children)}
        </svelte:element>
    {:else if node?.kind === 'text'}
        {#if node.textKind === 'label'}
            <label data-sd-node-id={node.id} for={node.htmlFor} class={classes(node)}>
                {node.text}
            </label>
        {:else}
            <svelte:element this={textTag(node)} data-sd-node-id={node.id} class={classes(node)}
                >{node.text}</svelte:element
            >
        {/if}
    {:else if node?.kind === 'component'}
        {@render component(node)}
    {/if}
{/snippet}

<div
    class="min-h-screen bg-background text-foreground"
    data-sd-preview-root
    onclickcapture={handleCapture}
>
    {#if page}
        {@render renderNode(page.rootNodeId)}
    {/if}
</div>
