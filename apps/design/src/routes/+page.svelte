<script lang="ts">
    import {
        Box,
        ChevronDown,
        ChevronUp,
        Code2,
        Component as ComponentIcon,
        Copy,
        Download,
        FilePlus2,
        FolderOpen,
        Frame,
        Grid2X2,
        Layers3,
        Monitor,
        MousePointer2,
        Play,
        Redo2,
        Save,
        SlidersHorizontal,
        Smartphone,
        Tablet,
        Trash2,
        Type,
        Undo2
    } from '@lucide/svelte';
    import {
        Alert,
        Badge,
        BrandMark,
        Button,
        Card,
        Input,
        ScrollArea,
        Slider,
        Tabs,
        ToggleGroup
    } from '@sivir-ui/svelte';
    import { onMount } from 'svelte';
    import { type CatalogFamily, COMPONENT_CATALOG, getCatalogDefinition } from '$lib/catalog';
    import { type GeneratedProject, generateSvelteProject } from '$lib/codegen';
    import {
        BLANK_DOCUMENT,
        type Breakpoint,
        type DesignDocument,
        type DesignNode,
        deriveParentReferences,
        exportPortableProject,
        importPortableProject,
        type LayoutKind,
        parseDesignDocument,
        type TextKind
    } from '$lib/document';
    import {
        type ChildLocation,
        createComponentTemplate,
        createDesignHistory,
        createLayoutTemplate,
        createTextTemplate,
        type DesignCommand,
        type DesignHistory,
        executeDesignCommand,
        type InsertionTemplate,
        redoDesignCommand,
        undoDesignCommand
    } from '$lib/editor';
    import EditorSelect from '$lib/editor/EditorSelect.svelte';
    import Inspector from '$lib/editor/Inspector.svelte';
    import OutlineTree from '$lib/editor/OutlineTree.svelte';
    import {
        createDesignRepository,
        type DesignRepository,
        type RepositoryMode
    } from '$lib/persistence';
    import {
        type HostInitMessage,
        type HostToPreviewMessage,
        PREVIEW_PROTOCOL_VERSION,
        type PreviewMode,
        type PreviewToHostMessage
    } from '$lib/preview/protocol';

    type SaveStatus = 'loading' | 'saved' | 'dirty' | 'saving' | 'error';
    type LeftPanel = 'outline' | 'insert';
    type RightPanel = 'inspect' | 'export';
    type MobilePanel = 'left' | 'right' | null;

    let history = $state.raw<DesignHistory>(createDesignHistory(BLANK_DOCUMENT, null));
    let activePageId = $state(BLANK_DOCUMENT.pages[0].id);
    let breakpoint = $state<Breakpoint>('base');
    let viewportWidth = $state(1024);
    let previewMode = $state<PreviewMode>('select');
    let leftPanel = $state<LeftPanel>('outline');
    let rightPanel = $state<RightPanel>('inspect');
    let mobilePanel = $state<MobilePanel>(null);
    let componentQuery = $state('');
    let saveStatus = $state<SaveStatus>('loading');
    let repositoryMode = $state<RepositoryMode>('memory');
    let statusDetail = $state('Opening local project');
    let errorMessage = $state<string | null>(null);
    let projectId = $state(BLANK_DOCUMENT.id);
    let repositoryRevision = $state(0);
    let localVersion = $state(0);
    let renderedRevision = $state(0);
    let repository: DesignRepository | null = null;
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    let saveInFlight = false;
    let iframeElement = $state<HTMLIFrameElement>();
    let previewPort = $state<MessagePort | null>(null);
    let previewReady = $state(false);
    let importInput = $state<HTMLInputElement>();
    let activeExportPath = $state('');

    const INSERT_LAYOUTS: readonly LayoutKind[] = ['section', 'stack', 'row', 'grid'];
    const INSERT_TEXT_KINDS: readonly TextKind[] = ['heading', 'paragraph'];
    const BREAKPOINTS: readonly Breakpoint[] = ['base', 'md', 'lg'];

    const activePage = $derived(
        history.document.pages.find((page) => page.id === activePageId) ?? history.document.pages[0]
    );
    const selectedNode = $derived(
        history.selection ? history.document.nodes[history.selection] : undefined
    );
    const activeRoot = $derived(history.document.nodes[activePage.rootNodeId]);
    const canvasIsEmpty = $derived(
        activeRoot?.kind === 'layout' && activeRoot.children.length === 0
    );
    const filteredCatalog = $derived(
        COMPONENT_CATALOG.filter((definition) => {
            const query = componentQuery.trim().toLowerCase();
            return (
                query === '' ||
                definition.label.toLowerCase().includes(query) ||
                definition.description.toLowerCase().includes(query)
            );
        })
    );
    const generatedProject = $derived.by((): GeneratedProject | null => {
        try {
            return generateSvelteProject(history.document);
        } catch {
            return null;
        }
    });
    const activeExport = $derived(
        generatedProject?.files.find((file) => file.path === activeExportPath) ??
            generatedProject?.files[0]
    );

    function createId(prefix: string): string {
        const value = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${localVersion}`;
        return `${prefix}-${value}`;
    }

    function nodeChildren(node: DesignNode): readonly string[] {
        if (node.kind === 'layout') {
            return node.children;
        }

        if (node.kind === 'component') {
            return Object.values(node.slots).flat();
        }

        return [];
    }

    function childList(document: DesignDocument, location: ChildLocation): readonly string[] {
        const parent = document.nodes[location.parentId];

        if (!parent) {
            return [];
        }

        if (parent.kind === 'layout') {
            return parent.children;
        }

        return location.slot && parent.kind === 'component'
            ? (parent.slots[location.slot] ?? [])
            : [];
    }

    function accepts(
        document: DesignDocument,
        parentId: string,
        slot: string | null,
        nodeKind: DesignNode['kind']
    ): boolean {
        const parent = document.nodes[parentId];

        if (parent?.kind === 'layout') {
            return slot === null;
        }

        if (parent?.kind !== 'component' || slot === null) {
            return false;
        }

        const definition = getCatalogDefinition(parent.family);
        const slotDefinition = definition.slots.find((candidate) => candidate.id === slot);

        if (!slotDefinition) {
            return false;
        }

        const currentLength = parent.slots[slot]?.length ?? 0;
        return (
            slotDefinition.allowedNodeKinds.includes(nodeKind) &&
            currentLength < slotDefinition.maxChildren
        );
    }

    function findInsertionLocation(nodeKind: DesignNode['kind']): ChildLocation {
        const document = history.document;
        const parents = deriveParentReferences(document);
        let candidateId = history.selection ?? activePage.rootNodeId;

        while (candidateId) {
            const candidate = document.nodes[candidateId];

            if (candidate?.kind === 'layout') {
                return {
                    parentId: candidate.id,
                    slot: null,
                    index: candidate.children.length
                };
            }

            if (candidate?.kind === 'component') {
                const definition = getCatalogDefinition(candidate.family);
                const slot = definition.slots.find((entry) =>
                    accepts(document, candidate.id, entry.id, nodeKind)
                );

                if (slot) {
                    return {
                        parentId: candidate.id,
                        slot: slot.id,
                        index: candidate.slots[slot.id]?.length ?? 0
                    };
                }
            }

            const reference = parents.get(candidateId);

            if (!reference) {
                break;
            }

            if (accepts(document, reference.parentId, reference.slot, nodeKind)) {
                return {
                    parentId: reference.parentId,
                    slot: reference.slot,
                    index: reference.index + 1
                };
            }

            candidateId = reference.parentId;
        }

        const root = document.nodes[activePage.rootNodeId];

        if (root?.kind !== 'layout') {
            throw new Error('The active page does not have an editable root.');
        }

        return { parentId: root.id, slot: null, index: root.children.length };
    }

    function postPreview(message: HostToPreviewMessage): void {
        if (previewReady) {
            previewPort?.postMessage(message);
        }
    }

    function syncPreview(): void {
        postPreview({
            type: 'document.load',
            revision: localVersion,
            document: history.document,
            pageId: activePageId
        });
        postPreview({ type: 'selection.set', nodeId: history.selection });
        postPreview({ type: 'mode.set', mode: previewMode });
    }

    function setSelection(nodeId: string | null): void {
        history = {
            ...history,
            selection: nodeId && Object.hasOwn(history.document.nodes, nodeId) ? nodeId : null
        };
        rightPanel = 'inspect';
        postPreview({ type: 'selection.set', nodeId: history.selection });
    }

    function scheduleSave(): void {
        if (saveTimer) {
            clearTimeout(saveTimer);
        }

        saveTimer = setTimeout(() => {
            void saveNow();
        }, 400);
    }

    async function saveNow(): Promise<void> {
        if (!repository || saveInFlight) {
            return;
        }

        saveInFlight = true;
        saveStatus = 'saving';
        statusDetail =
            repository.mode === 'indexeddb' ? 'Saving locally' : 'Changes only in memory';
        const versionAtStart = localVersion;

        try {
            const saved = await repository.save(projectId, history.document, repositoryRevision);
            repositoryRevision = saved.revision;

            if (versionAtStart === localVersion) {
                saveStatus = 'saved';
                statusDetail =
                    repository.mode === 'indexeddb'
                        ? `Saved locally at ${new Date(saved.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Changes only in memory. Export a project copy.';
            } else {
                saveStatus = 'dirty';
                scheduleSave();
            }
        } catch (error) {
            saveStatus = 'error';
            errorMessage = error instanceof Error ? error.message : 'Local save failed.';
            statusDetail = 'Changes are only in memory';
        } finally {
            saveInFlight = false;
        }
    }

    function applyCommand(command: DesignCommand, transactionId?: string): void {
        try {
            history = executeDesignCommand(history, command, {
                transactionId,
                selection: history.selection
            });
            localVersion += 1;
            saveStatus = 'dirty';
            statusDetail = 'Unsaved local changes';
            errorMessage = null;
            syncPreview();
            scheduleSave();
        } catch (error) {
            errorMessage =
                error instanceof Error ? error.message : 'The edit could not be applied.';
        }
    }

    function insertTemplate(template: InsertionTemplate): void {
        const root = template.nodes[template.rootNodeId];

        if (!root) {
            return;
        }

        const location = findInsertionLocation(root.kind);
        applyCommand({
            type: 'insert-subtree',
            rootNodeId: template.rootNodeId,
            nodes: template.nodes,
            location
        });
        setSelection(template.rootNodeId);
        leftPanel = 'outline';
        mobilePanel = null;
    }

    function insertComponent(family: CatalogFamily): void {
        insertTemplate(createComponentTemplate(family, createId(family)));
    }

    function insertLayout(layout: LayoutKind): void {
        insertTemplate(createLayoutTemplate(createId(layout), layout));
    }

    function insertText(textKind: TextKind): void {
        insertTemplate(createTextTemplate(createId(textKind), textKind));
    }

    function moveSelection(direction: -1 | 1): void {
        if (!history.selection) {
            return;
        }

        const reference = deriveParentReferences(history.document).get(history.selection);

        if (!reference) {
            return;
        }

        const children = childList(history.document, reference);
        const index = reference.index + direction;

        if (index < 0 || index >= children.length) {
            return;
        }

        applyCommand({
            type: 'move-node',
            nodeId: history.selection,
            location: { ...reference, index }
        });
    }

    function removeSelection(): void {
        if (!history.selection) {
            return;
        }

        const reference = deriveParentReferences(history.document).get(history.selection);

        if (!reference) {
            return;
        }

        const nextSelection = reference.parentId;
        applyCommand({ type: 'remove-node', nodeId: history.selection });
        setSelection(nextSelection);
    }

    function collectSubtreeIds(rootNodeId: string): readonly string[] {
        const ids: string[] = [];
        const pending = [rootNodeId];

        while (pending.length > 0) {
            const nodeId = pending.pop();

            if (!nodeId || ids.includes(nodeId)) {
                continue;
            }

            ids.push(nodeId);
            const node = history.document.nodes[nodeId];

            if (node) {
                pending.push(...nodeChildren(node));
            }
        }

        return ids;
    }

    function duplicateSelection(): void {
        if (!history.selection) {
            return;
        }

        const reference = deriveParentReferences(history.document).get(history.selection);

        if (!reference) {
            return;
        }

        const idMap: Record<string, string> = {};

        for (const sourceId of collectSubtreeIds(history.selection)) {
            idMap[sourceId] = createId(sourceId);
        }

        const duplicatedId = idMap[history.selection];

        applyCommand({
            type: 'duplicate-subtree',
            nodeId: history.selection,
            idMap,
            location: { ...reference, index: reference.index + 1 }
        });
        setSelection(duplicatedId);
    }

    function undo(): void {
        if (history.past.length === 0) {
            return;
        }

        history = undoDesignCommand(history);
        localVersion += 1;
        saveStatus = 'dirty';
        syncPreview();
        scheduleSave();
    }

    function redo(): void {
        if (history.future.length === 0) {
            return;
        }

        history = redoDesignCommand(history);
        localVersion += 1;
        saveStatus = 'dirty';
        syncPreview();
        scheduleSave();
    }

    function setViewport(width: number): void {
        viewportWidth = width;
        breakpoint = width >= 1024 ? 'lg' : width >= 768 ? 'md' : 'base';
    }

    function togglePreviewMode(): void {
        previewMode = previewMode === 'select' ? 'interact' : 'select';
        postPreview({ type: 'mode.set', mode: previewMode });
    }

    function connectPreview(): void {
        if (!iframeElement?.contentWindow) {
            return;
        }

        previewPort?.close();
        previewReady = false;
        const channel = new MessageChannel();
        const sessionId = createId('preview');
        previewPort = channel.port1;
        previewPort.onmessage = (event: MessageEvent<PreviewToHostMessage>) => {
            const message = event.data;

            if (message.type === 'preview.ready' && message.sessionId === sessionId) {
                previewReady = true;
                syncPreview();
            } else if (message.type === 'selection.intent') {
                setSelection(message.nodeId);
            } else if (message.type === 'document.rendered') {
                renderedRevision = message.revision;
            }
        };
        previewPort.start();
        const message: HostInitMessage = {
            type: 'sivir-design/host-init',
            protocolVersion: PREVIEW_PROTOCOL_VERSION,
            sessionId
        };
        iframeElement.contentWindow.postMessage(message, '*', [channel.port2]);
    }

    function downloadText(path: string, content: string, type = 'text/plain'): void {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = path.split('/').at(-1) ?? path;
        link.click();
        URL.revokeObjectURL(url);
    }

    function exportProjectFile(): void {
        downloadText(
            `${history.document.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-') || 'design'}.sivir-design.json`,
            exportPortableProject(history.document),
            'application/json'
        );
    }

    async function importProjectFile(event: Event): Promise<void> {
        const input = event.currentTarget as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        try {
            const imported = importPortableProject(await file.text());
            const nextId = createId('project');
            const next = parseDesignDocument({ ...imported.document, id: nextId });
            projectId = nextId;
            repositoryRevision = 0;
            history = createDesignHistory(next, next.pages[0].rootNodeId);
            activePageId = next.pages[0].id;
            localVersion += 1;
            saveStatus = 'dirty';
            syncPreview();
            await saveNow();
        } catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Project import failed.';
        } finally {
            input.value = '';
        }
    }

    function newProject(): void {
        const nextId = createId('project');
        const next = parseDesignDocument({
            ...structuredClone(BLANK_DOCUMENT),
            id: nextId,
            name: 'Untitled'
        });
        projectId = nextId;
        repositoryRevision = 0;
        history = createDesignHistory(next, null);
        activePageId = next.pages[0].id;
        localVersion += 1;
        saveStatus = 'dirty';
        syncPreview();
        scheduleSave();
    }

    async function copyActiveExport(): Promise<void> {
        if (!activeExport) {
            return;
        }

        try {
            await navigator.clipboard.writeText(activeExport.content);
            statusDetail = `Copied ${activeExport.path}`;
        } catch {
            errorMessage = 'Clipboard access was blocked. Download the file instead.';
        }
    }

    function isTextControl(target: EventTarget | null): boolean {
        return (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            (target instanceof HTMLElement && target.isContentEditable)
        );
    }

    onMount(() => {
        let cancelled = false;

        void (async () => {
            repository = await createDesignRepository();
            repositoryMode = repository.mode;

            if (repository.fallbackReason) {
                statusDetail = repository.fallbackReason;
            }

            try {
                const loaded = await repository.load(projectId);

                if (cancelled) {
                    return;
                }

                if (loaded) {
                    history = createDesignHistory(loaded.document, null);
                    activePageId = loaded.document.pages[0].id;
                    repositoryRevision = loaded.revision;
                    saveStatus = 'saved';
                    statusDetail = 'Opened local project';
                    syncPreview();
                } else {
                    const saved = await repository.save(projectId, history.document, 0);
                    repositoryRevision = saved.revision;
                    saveStatus = 'saved';
                    statusDetail =
                        repository.mode === 'indexeddb'
                            ? 'Saved locally'
                            : 'Changes only in memory. Export a project copy.';
                }
            } catch (error) {
                saveStatus = 'error';
                errorMessage =
                    error instanceof Error ? error.message : 'The project could not open.';
                statusDetail = 'Changes are only in memory';
            }
        })();

        function handleKeydown(event: KeyboardEvent): void {
            const modifier = event.metaKey || event.ctrlKey;

            if (isTextControl(event.target)) {
                if (modifier && event.key.toLowerCase() === 's') {
                    event.preventDefault();
                    void saveNow();
                }
                return;
            }

            if (modifier && event.key.toLowerCase() === 'z') {
                event.preventDefault();
                event.shiftKey ? redo() : undo();
            } else if (modifier && event.key.toLowerCase() === 's') {
                event.preventDefault();
                void saveNow();
            } else if (modifier && event.key === 'Enter') {
                event.preventDefault();
                togglePreviewMode();
            } else if (modifier && event.key.toLowerCase() === 'd') {
                event.preventDefault();
                duplicateSelection();
            } else if (event.altKey && event.key === 'ArrowUp') {
                event.preventDefault();
                moveSelection(-1);
            } else if (event.altKey && event.key === 'ArrowDown') {
                event.preventDefault();
                moveSelection(1);
            } else if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                removeSelection();
            } else if (event.key.toLowerCase() === 'i') {
                leftPanel = 'insert';
                mobilePanel = 'left';
            } else if (event.key === '1') {
                setViewport(390);
            } else if (event.key === '2') {
                setViewport(768);
            } else if (event.key === '3') {
                setViewport(1440);
            } else if (event.key === 'Escape') {
                if (mobilePanel) {
                    mobilePanel = null;
                } else if (leftPanel === 'insert') {
                    leftPanel = 'outline';
                } else if (history.selection) {
                    setSelection(
                        deriveParentReferences(history.document).get(history.selection)?.parentId ??
                            null
                    );
                }
            }
        }

        function handlePreviewBootstrap(event: MessageEvent): void {
            if (
                event.source === iframeElement?.contentWindow &&
                typeof event.data === 'object' &&
                event.data !== null &&
                (event.data as { type?: unknown }).type === 'sivir-design/preview-bootstrap'
            ) {
                connectPreview();
            }
        }

        function handleWindowResize(): void {
            if (window.innerWidth < 640 && viewportWidth > 390) {
                setViewport(390);
            }
        }

        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('message', handlePreviewBootstrap);
        window.addEventListener('resize', handleWindowResize);
        handleWindowResize();

        return () => {
            cancelled = true;
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('message', handlePreviewBootstrap);
            window.removeEventListener('resize', handleWindowResize);
            if (saveTimer) {
                clearTimeout(saveTimer);
            }
            previewPort?.close();
            repository?.close();
        };
    });
</script>

<svelte:head>
    <title>Sivir Design</title>
    <meta
        name="description"
        content="A local-first editor for responsive Svelte interfaces built with Sivir UI."
    />
</svelte:head>

<div class="flex h-[100svh] min-h-[520px] flex-col overflow-hidden bg-background text-foreground">
    <header
        class="relative z-40 flex h-12 shrink-0 items-center border-b border-border bg-panel px-2"
    >
        <div class="flex min-w-0 items-center gap-1.5">
            <BrandMark size={22} class="ml-1" label="Sivir Design" />
            <div class="hidden w-36 sm:block">
                <Input
                    aria-label="Project name"
                    class="h-8 border-transparent bg-transparent px-2 font-medium shadow-none hover:bg-secondary focus-visible:bg-card"
                    value={history.document.name}
                    onchange={(event) => {
                        const name = event.currentTarget.value.trim();
                        if (name && name !== history.document.name) {
                            applyCommand({ type: 'set-document-name', name });
                        }
                    }}
                    onkeydown={(event) => {
                        if (event.key === 'Enter') {
                            event.currentTarget.blur();
                        }
                    }}
                />
            </div>
            <Badge
                class="hidden md:flex"
                variant={saveStatus === 'error'
                    ? 'error'
                    : saveStatus === 'saved'
                      ? 'success'
                      : 'secondary'}
            >
                {saveStatus === 'saving' ? 'Saving' : saveStatus}
            </Badge>
        </div>

        <div
            class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-[var(--elevation-1)] lg:flex"
        >
            <Button
                size="sm"
                variant={previewMode === 'select' ? 'secondary' : 'quiet'}
                onclick={() => {
                    previewMode = 'select';
                    postPreview({ type: 'mode.set', mode: previewMode });
                }}
            >
                <MousePointer2 size={14} aria-hidden="true" />
                Design
            </Button>
            <Button
                size="sm"
                variant={previewMode === 'interact' ? 'secondary' : 'quiet'}
                onclick={() => {
                    previewMode = 'interact';
                    postPreview({ type: 'mode.set', mode: previewMode });
                }}
            >
                <Play size={14} aria-hidden="true" />
                Preview
            </Button>
        </div>

        <div class="ml-auto flex items-center gap-1">
            <Button
                size="sm"
                variant="quiet"
                class="lg:hidden"
                aria-label="Open layers"
                onclick={() => {
                    mobilePanel = mobilePanel === 'left' ? null : 'left';
                }}
            >
                <Layers3 size={15} aria-hidden="true" />
                <span class="hidden sm:inline">Layers</span>
            </Button>
            <Button
                size="sm"
                variant="quiet"
                class="lg:hidden"
                aria-label="Open properties"
                onclick={() => {
                    mobilePanel = mobilePanel === 'right' ? null : 'right';
                }}
            >
                <SlidersHorizontal size={15} aria-hidden="true" />
                <span class="hidden sm:inline">Design</span>
            </Button>
            <Button
                size="sm"
                variant="quiet"
                aria-label="Undo"
                onclick={undo}
                disabled={history.past.length === 0}
            >
                <Undo2 size={15} aria-hidden="true" />
            </Button>
            <Button
                size="sm"
                variant="quiet"
                aria-label="Redo"
                onclick={redo}
                disabled={history.future.length === 0}
            >
                <Redo2 size={15} aria-hidden="true" />
            </Button>
            <Button
                size="sm"
                variant="secondary"
                onclick={() => {
                    rightPanel = 'export';
                    mobilePanel = 'right';
                }}
            >
                <Download size={14} aria-hidden="true" />
                <span class="hidden sm:inline">Export</span>
            </Button>
        </div>
    </header>

    {#if mobilePanel}
        <Button
            unstyled
            aria-label="Close panel"
            class="fixed inset-0 z-20 bg-overlay lg:hidden"
            onclick={() => {
                mobilePanel = null;
            }}
        />
    {/if}

    <main
        class="relative grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[224px_minmax(0,1fr)_288px]"
    >
        <aside
            class="fixed inset-y-12 left-0 z-30 min-h-0 w-72 flex-col overflow-hidden border-r border-border bg-panel lg:static lg:flex lg:h-full lg:w-auto"
            class:flex={mobilePanel === 'left'}
            class:hidden={mobilePanel !== 'left'}
        >
            <Tabs.Root bind:value={leftPanel} variant="ghost" class="flex min-h-0 flex-1 flex-col">
                <Tabs.List class="grid grid-cols-2 gap-1 border-b border-border px-2 py-1.5">
                    <Tabs.Trigger value="outline" class="min-h-8 py-1.5">Layers</Tabs.Trigger>
                    <Tabs.Trigger value="insert" class="min-h-8 py-1.5">Assets</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="outline" class="min-h-0 flex-1">
                    <ScrollArea class="h-full" showCues={false}>
                        <div class="p-2">
                            <div class="mb-1 flex items-center gap-1">
                                <Button
                                    size="sm"
                                    variant="quiet"
                                    class={`min-w-0 flex-1 justify-start gap-2 ${history.selection === activePage.rootNodeId ? 'bg-accent-tint' : ''}`}
                                    onclick={() => setSelection(activePage.rootNodeId)}
                                >
                                    <Frame size={14} aria-hidden="true" />
                                    <span class="truncate">{activePage.name}</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="quiet"
                                    aria-label="Move layer up"
                                    onclick={() => moveSelection(-1)}
                                >
                                    <ChevronUp size={14} aria-hidden="true" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="quiet"
                                    aria-label="Move layer down"
                                    onclick={() => moveSelection(1)}
                                >
                                    <ChevronDown size={14} aria-hidden="true" />
                                </Button>
                            </div>
                            <OutlineTree
                                document={history.document}
                                rootNodeId={activePage.rootNodeId}
                                selectedNodeId={history.selection}
                                onselect={setSelection}
                            />
                        </div>
                    </ScrollArea>
                </Tabs.Content>

                <Tabs.Content value="insert" class="min-h-0 flex-1">
                    <ScrollArea class="h-full" showCues={false}>
                        <div class="grid gap-4 p-3">
                            <Input
                                type="search"
                                variant="secondary"
                                placeholder="Search assets"
                                aria-label="Search assets"
                                bind:value={componentQuery}
                            />

                            {#if componentQuery.trim() === ''}
                                <section class="grid gap-2">
                                    <h2 class="px-1 text-xs font-semibold">Layout</h2>
                                    <div class="grid grid-cols-2 gap-1">
                                        {#each INSERT_LAYOUTS as layout}
                                            <Button
                                                size="sm"
                                                variant="quiet"
                                                class="h-16 flex-col items-start justify-between border border-transparent p-2 capitalize hover:border-border hover:bg-background"
                                                onclick={() => insertLayout(layout)}
                                            >
                                                {#if layout === 'grid'}
                                                    <Grid2X2 size={16} aria-hidden="true" />
                                                {:else}
                                                    <Box size={16} aria-hidden="true" />
                                                {/if}
                                                {layout}
                                            </Button>
                                        {/each}
                                    </div>
                                </section>

                                <section class="grid gap-2 border-t border-border pt-3">
                                    <h2 class="px-1 text-xs font-semibold">Text</h2>
                                    <div class="grid grid-cols-2 gap-1">
                                        {#each INSERT_TEXT_KINDS as textKind}
                                            <Button
                                                size="sm"
                                                variant="quiet"
                                                class="justify-start gap-2 capitalize"
                                                onclick={() => insertText(textKind)}
                                            >
                                                <Type size={14} aria-hidden="true" />
                                                {textKind}
                                            </Button>
                                        {/each}
                                    </div>
                                </section>
                            {/if}

                            <section class="grid gap-1 border-t border-border pt-3">
                                <div class="mb-1 flex items-center justify-between px-1">
                                    <h2 class="text-xs font-semibold">Sivir components</h2>
                                    <Badge variant="secondary">{filteredCatalog.length}</Badge>
                                </div>
                                {#each filteredCatalog as definition (definition.family)}
                                    <Button
                                        size="sm"
                                        variant="quiet"
                                        class="h-9 w-full justify-start gap-2"
                                        onclick={() => insertComponent(definition.family)}
                                    >
                                        <ComponentIcon size={14} aria-hidden="true" />
                                        {definition.label}
                                    </Button>
                                {/each}
                                {#if filteredCatalog.length === 0}
                                    <p class="px-2 py-8 text-center text-sm text-foreground-muted">
                                        No asset matches “{componentQuery}”.
                                    </p>
                                {/if}
                            </section>
                        </div>
                    </ScrollArea>
                </Tabs.Content>
            </Tabs.Root>

            <div class="flex items-center gap-1 border-t border-border p-2">
                <Button size="sm" variant="quiet" aria-label="New design" onclick={newProject}>
                    <FilePlus2 size={14} aria-hidden="true" />
                </Button>
                <Button
                    size="sm"
                    variant="quiet"
                    aria-label="Duplicate layer"
                    onclick={duplicateSelection}
                    disabled={!selectedNode}
                >
                    <Copy size={14} aria-hidden="true" />
                </Button>
                <Button
                    size="sm"
                    variant="quiet"
                    aria-label="Delete layer"
                    onclick={removeSelection}
                    disabled={!selectedNode}
                >
                    <Trash2 size={14} aria-hidden="true" />
                </Button>
                <span class="ml-auto font-mono text-[10px] text-foreground-subtle">
                    {Object.keys(history.document.nodes).length}
                    layers
                </span>
            </div>
        </aside>

        <section
            class="flex min-h-0 min-w-0 flex-col overflow-hidden bg-muted"
            aria-label="Responsive canvas"
        >
            <div class="flex min-h-11 items-center gap-2 border-b border-border bg-panel px-2">
                <div class="flex items-center gap-1" aria-label="Viewport presets">
                    <Button
                        size="sm"
                        variant={viewportWidth === 390 ? 'secondary' : 'quiet'}
                        aria-label="Phone viewport, 390 pixels"
                        onclick={() => setViewport(390)}
                    >
                        <Smartphone size={14} aria-hidden="true" />
                    </Button>
                    <Button
                        size="sm"
                        variant={viewportWidth === 768 ? 'secondary' : 'quiet'}
                        aria-label="Tablet viewport, 768 pixels"
                        onclick={() => setViewport(768)}
                    >
                        <Tablet size={14} aria-hidden="true" />
                    </Button>
                    <Button
                        size="sm"
                        variant={viewportWidth === 1440 ? 'secondary' : 'quiet'}
                        aria-label="Desktop viewport, 1440 pixels"
                        onclick={() => setViewport(1440)}
                    >
                        <Monitor size={14} aria-hidden="true" />
                    </Button>
                </div>
                <Slider
                    class="hidden max-w-40 flex-1 sm:flex"
                    min={320}
                    max={1920}
                    step={1}
                    value={viewportWidth}
                    label="Preview width"
                    onValueChange={setViewport}
                />
                <div class="hidden w-20 sm:block">
                    <Input
                        type="number"
                        min={320}
                        max={1920}
                        aria-label="Preview width in pixels"
                        class="h-8 min-h-0 font-mono text-xs"
                        value={viewportWidth}
                        oninput={(event) => setViewport(Math.min(1920, Math.max(320, event.currentTarget.valueAsNumber)))}
                    />
                </div>
                <ToggleGroup.Root
                    type="single"
                    value={breakpoint}
                    class="ml-auto"
                    onValueChange={(value) => {
                        if (value === 'base' || value === 'md' || value === 'lg') {
                            breakpoint = value;
                        }
                    }}
                >
                    {#each BREAKPOINTS as scope}
                        <ToggleGroup.Item
                            value={scope}
                            class="h-8 min-h-0 px-2 font-mono text-[10px] uppercase"
                        >
                            {scope}
                        </ToggleGroup.Item>
                    {/each}
                </ToggleGroup.Root>
            </div>

            <div class="min-h-0 flex-1 overflow-auto p-4 sm:p-8">
                <div class="mx-auto min-w-fit">
                    <div
                        class="mb-2 flex items-center justify-between font-mono text-[10px] text-foreground-subtle"
                    >
                        <span>{activePage.name} · {viewportWidth}px</span>
                        <span>{previewMode === 'select' ? 'Design mode' : 'Preview mode'}</span>
                    </div>
                    <div
                        class="relative overflow-hidden border border-border bg-background shadow-[var(--elevation-float)]"
                        style:width={`${viewportWidth}px`}
                        style:max-width="calc(100vw - 2rem)"
                    >
                        <iframe
                            bind:this={iframeElement}
                            title="Design preview"
                            src="/preview"
                            class="block h-[min(860px,calc(100svh-9rem))] min-h-[560px] w-full border-0 bg-background"
                            sandbox="allow-scripts allow-same-origin"
                            referrerpolicy="no-referrer"
                            onload={connectPreview}
                        ></iframe>

                        {#if canvasIsEmpty}
                            <div
                                class="pointer-events-none absolute inset-0 grid place-items-center p-6"
                            >
                                <Card.Root
                                    class="pointer-events-auto w-full max-w-72 shadow-[var(--elevation-float)]"
                                >
                                    <Card.Header>
                                        <Card.Title>Start with a blank page</Card.Title>
                                        <Card.Description
                                            >Add a structure, text, or Sivir component. Nothing is
                                            generated until you place it.</Card.Description
                                        >
                                    </Card.Header>
                                    <Card.Content class="grid gap-1.5">
                                        <Button
                                            variant="secondary"
                                            class="justify-start gap-2"
                                            onclick={() => insertLayout('section')}
                                        >
                                            <Frame size={14} aria-hidden="true" />
                                            Add section
                                        </Button>
                                        <Button
                                            variant="quiet"
                                            class="justify-start gap-2"
                                            onclick={() => insertText('heading')}
                                        >
                                            <Type size={14} aria-hidden="true" />
                                            Add heading
                                        </Button>
                                        <Button
                                            variant="quiet"
                                            class="justify-start gap-2"
                                            onclick={() => insertComponent('button')}
                                        >
                                            <ComponentIcon size={14} aria-hidden="true" />
                                            Add button
                                        </Button>
                                    </Card.Content>
                                </Card.Root>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <footer
                class="flex min-h-7 items-center justify-between border-t border-border bg-panel px-3 font-mono text-[10px] text-foreground-subtle"
            >
                <span class="truncate">{statusDetail}</span>
                <span class="hidden sm:inline"
                    >{repositoryMode}
                    · r{repositoryRevision}
                    · view {renderedRevision}</span
                >
            </footer>
        </section>

        <aside
            class="fixed inset-y-12 right-0 z-30 min-h-0 w-[min(92vw,340px)] flex-col overflow-hidden border-l border-border bg-panel lg:static lg:flex lg:h-full lg:w-auto"
            class:flex={mobilePanel === 'right'}
            class:hidden={mobilePanel !== 'right'}
        >
            <Tabs.Root bind:value={rightPanel} variant="ghost" class="flex min-h-0 flex-1 flex-col">
                <Tabs.List class="grid grid-cols-2 gap-1 border-b border-border px-2 py-1.5">
                    <Tabs.Trigger value="inspect" class="min-h-8 py-1.5">Design</Tabs.Trigger>
                    <Tabs.Trigger value="export" class="min-h-8 py-1.5">Code</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="inspect" class="min-h-0 flex-1">
                    <ScrollArea class="h-full" showCues={false}>
                        <Inspector
                            document={history.document}
                            selectedNodeId={history.selection}
                            {breakpoint}
                            onchange={applyCommand}
                        />
                    </ScrollArea>
                </Tabs.Content>

                <Tabs.Content value="export" class="min-h-0 flex-1">
                    <ScrollArea class="h-full" showCues={false}>
                        {#if generatedProject}
                            <div class="grid gap-4 p-3">
                                <header class="grid gap-1">
                                    <div class="flex items-center gap-2">
                                        <Code2 size={15} aria-hidden="true" />
                                        <h2 class="font-semibold">Generated Svelte</h2>
                                    </div>
                                    <p class="text-xs leading-relaxed text-foreground-muted">
                                        Public Sivir imports and literal responsive classes. No
                                        editor runtime.
                                    </p>
                                </header>
                                <EditorSelect
                                    label="Generated file"
                                    value={activeExport?.path ?? ''}
                                    options={generatedProject.files.map((file) => file.path)}
                                    onchange={(value) => {
                                        activeExportPath = value;
                                    }}
                                />
                                {#if activeExport}
                                    <pre
                                        class="max-h-[52svh] overflow-auto border-y border-border py-3 font-mono text-[10px] leading-relaxed text-foreground-muted"
                                    ><code>{activeExport.content}</code></pre>
                                    <div class="grid grid-cols-2 gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onclick={copyActiveExport}
                                        >
                                            <Copy size={14} aria-hidden="true" />
                                            Copy
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onclick={() => downloadText(activeExport.path, activeExport.content)}
                                        >
                                            <Download size={14} aria-hidden="true" />
                                            Download
                                        </Button>
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <p class="p-4 text-sm text-error">
                                Export is blocked until the document is valid.
                            </p>
                        {/if}
                    </ScrollArea>
                </Tabs.Content>
            </Tabs.Root>

            <div class="grid grid-cols-2 gap-1 border-t border-border p-2">
                <div class="hidden">
                    <Input
                        bind:element={importInput}
                        type="file"
                        accept=".json,.sivir-design.json,application/json"
                        onchange={importProjectFile}
                    />
                </div>
                <Button size="sm" variant="quiet" onclick={() => importInput?.click()}>
                    <FolderOpen size={14} aria-hidden="true" />
                    Open
                </Button>
                <Button size="sm" variant="quiet" onclick={exportProjectFile}>
                    <Save size={14} aria-hidden="true" />
                    Save copy
                </Button>
            </div>
        </aside>
    </main>

    {#if errorMessage}
        <div class="fixed bottom-4 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2">
            <Alert.Root variant="error" class="shadow-[var(--elevation-alert-error)]">
                <Alert.Title>Design action failed</Alert.Title>
                <Alert.Description>{errorMessage}</Alert.Description>
                <Button
                    size="sm"
                    variant="quiet"
                    onclick={() => {
                        errorMessage = null;
                    }}
                >
                    Dismiss
                </Button>
            </Alert.Root>
        </div>
    {/if}
</div>
