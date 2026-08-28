import type { DesignDocument } from '../document/types';

export const PREVIEW_PROTOCOL_VERSION = 1 as const;

export type PreviewMode = 'select' | 'interact';

export type HostInitMessage = {
    readonly type: 'sivir-design/host-init';
    readonly protocolVersion: typeof PREVIEW_PROTOCOL_VERSION;
    readonly sessionId: string;
};

export type HostToPreviewMessage =
    | {
          readonly type: 'document.load';
          readonly revision: number;
          readonly document: DesignDocument;
          readonly pageId: string;
      }
    | { readonly type: 'selection.set'; readonly nodeId: string | null }
    | { readonly type: 'mode.set'; readonly mode: PreviewMode };

export type PreviewToHostMessage =
    | {
          readonly type: 'preview.ready';
          readonly protocolVersion: typeof PREVIEW_PROTOCOL_VERSION;
          readonly sessionId: string;
      }
    | { readonly type: 'document.rendered'; readonly revision: number }
    | { readonly type: 'selection.intent'; readonly nodeId: string };

export function isHostInitMessage(value: unknown): value is HostInitMessage {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const message = value as Record<string, unknown>;
    return (
        message.type === 'sivir-design/host-init' &&
        message.protocolVersion === PREVIEW_PROTOCOL_VERSION &&
        typeof message.sessionId === 'string'
    );
}

export function isHostToPreviewMessage(value: unknown): value is HostToPreviewMessage {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const message = value as Record<string, unknown>;

    if (message.type === 'selection.set') {
        return message.nodeId === null || typeof message.nodeId === 'string';
    }

    if (message.type === 'mode.set') {
        return message.mode === 'select' || message.mode === 'interact';
    }

    return (
        message.type === 'document.load' &&
        Number.isInteger(message.revision) &&
        typeof message.pageId === 'string' &&
        typeof message.document === 'object' &&
        message.document !== null
    );
}
