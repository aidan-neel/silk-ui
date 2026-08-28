<script lang="ts">
    import { Box, Component as ComponentIcon, Frame, Type } from '@lucide/svelte';
    import { Button } from '@sivir-ui/svelte';
    import { getCatalogDefinition } from '../catalog';
    import type { DesignDocument, DesignNode } from '../document';

    type Props = {
        document: DesignDocument;
        rootNodeId: string;
        selectedNodeId: string | null;
        onselect: (nodeId: string) => void;
    };

    let { document, rootNodeId, selectedNodeId, onselect }: Props = $props();

    const root = $derived(document.nodes[rootNodeId]);
    const rootChildren = $derived(root ? childIds(root) : []);

    function childIds(node: DesignNode): readonly string[] {
        if (node.kind === 'layout') {
            return node.children;
        }

        if (node.kind === 'component') {
            return Object.values(node.slots)
                .flat()
                .filter((nodeId) => document.nodes[nodeId]?.kind !== 'text');
        }

        return [];
    }

    function label(node: DesignNode): string {
        if (node.kind === 'layout') {
            return node.label ?? `${node.layout.charAt(0).toUpperCase()}${node.layout.slice(1)}`;
        }

        if (node.kind === 'component') {
            return getCatalogDefinition(node.family).label;
        }

        const value = node.text.trim() || 'Empty text';
        return value.length > 34 ? `${value.slice(0, 33)}...` : value;
    }

    function indentation(depth: number): string {
        return ['pl-2', 'pl-5', 'pl-8', 'pl-11'][Math.min(depth, 3)] ?? 'pl-11';
    }
</script>

{#snippet branch(nodeId: string, depth: number)}
    {@const node = document.nodes[nodeId]}
    {#if node}
        <li class="min-w-0">
            <Button
                size="sm"
                variant="quiet"
                class={`w-full justify-start gap-2 ${indentation(depth)} ${selectedNodeId === node.id ? 'bg-accent-tint text-foreground' : 'text-foreground-muted'}`}
                aria-current={selectedNodeId === node.id ? 'true' : undefined}
                onclick={() => onselect(node.id)}
            >
                {#if node.kind === 'layout'}
                    <Frame size={14} aria-hidden="true" />
                {:else if node.kind === 'component'}
                    <ComponentIcon size={14} aria-hidden="true" />
                {:else}
                    <Type size={14} aria-hidden="true" />
                {/if}
                <span class="min-w-0 truncate">{label(node)}</span>
            </Button>
            {#if childIds(node).length > 0}
                <ul class="min-w-0">
                    {#each childIds(node) as childId (childId)}
                        {@render branch(childId, depth + 1)}
                    {/each}
                </ul>
            {/if}
        </li>
    {/if}
{/snippet}

{#if rootChildren.length > 0}
    <ul class="grid min-w-0 gap-0.5" aria-label="Document layers">
        {#each rootChildren as childId (childId)}
            {@render branch(childId, 0)}
        {/each}
    </ul>
{:else}
    <div class="grid place-items-center gap-2 px-5 py-10 text-center text-foreground-muted">
        <Box size={18} aria-hidden="true" />
        <p class="text-sm">No layers yet</p>
    </div>
{/if}
