<script lang="ts">
    import { themeToCss } from '@sivir-ui/svelte/themes/theme';
    import { onMount, tick } from 'svelte';
    import { type DesignDocument, parseDesignDocument, SAMPLE_DOCUMENT } from '$lib/document';
    import PreviewCanvas from '$lib/preview/PreviewCanvas.svelte';
    import {
        isHostInitMessage,
        isHostToPreviewMessage,
        PREVIEW_PROTOCOL_VERSION,
        type PreviewMode,
        type PreviewToHostMessage
    } from '$lib/preview/protocol';

    let designDocument = $state<DesignDocument>(SAMPLE_DOCUMENT);
    let pageId = $state(SAMPLE_DOCUMENT.pages[0].id);
    let selectedNodeId = $state<string | null>(null);
    let mode = $state<PreviewMode>('select');
    let port = $state<MessagePort | null>(null);
    let sessionId = $state('standalone');

    function applyAppearance(next: DesignDocument): void {
        const styleId = 'sivir-design-preview-theme';
        let style = window.document.getElementById(styleId) as HTMLStyleElement | null;

        if (!style) {
            style = window.document.createElement('style');
            style.id = styleId;
            window.document.head.append(style);
        }

        style.textContent = themeToCss(next.appearance.theme);
        window.document.documentElement.classList.toggle(
            'dark',
            next.appearance.colorMode === 'dark'
        );
    }

    function send(message: PreviewToHostMessage): void {
        port?.postMessage(message);
    }

    function selectNode(nodeId: string): void {
        selectedNodeId = nodeId;
        send({ type: 'selection.intent', nodeId });
    }

    onMount(() => {
        applyAppearance(designDocument);

        function connect(event: MessageEvent): void {
            if (
                event.source !== window.parent ||
                (event.origin !== window.location.origin && event.origin !== 'null') ||
                !isHostInitMessage(event.data) ||
                event.ports.length !== 1
            ) {
                return;
            }

            port?.close();
            sessionId = event.data.sessionId;
            port = event.ports[0];
            port.onmessage = async (portEvent: MessageEvent<unknown>) => {
                if (!isHostToPreviewMessage(portEvent.data)) {
                    return;
                }

                const message = portEvent.data;

                if (message.type === 'selection.set') {
                    selectedNodeId = message.nodeId;
                    return;
                }

                if (message.type === 'mode.set') {
                    mode = message.mode;
                    return;
                }

                try {
                    designDocument = parseDesignDocument(message.document);
                    pageId = designDocument.pages.some((page) => page.id === message.pageId)
                        ? message.pageId
                        : designDocument.pages[0].id;
                    applyAppearance(designDocument);
                    await tick();
                    send({ type: 'document.rendered', revision: message.revision });
                } catch {
                    return;
                }
            };
            port.start();
            send({
                type: 'preview.ready',
                protocolVersion: PREVIEW_PROTOCOL_VERSION,
                sessionId
            });
        }

        window.addEventListener('message', connect);
        window.parent.postMessage(
            { type: 'sivir-design/preview-bootstrap', protocolVersion: PREVIEW_PROTOCOL_VERSION },
            '*'
        );

        return () => {
            window.removeEventListener('message', connect);
            port?.close();
        };
    });
</script>

<svelte:head>
    <title>Sivir Design preview</title>
</svelte:head>

<PreviewCanvas document={designDocument} {pageId} {selectedNodeId} {mode} onselect={selectNode} />
