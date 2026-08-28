import { Markdown } from '@sivir-ui/svelte/components/markdown';
import type { Component } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import AttachmentFixture from '../../fixtures/AttachmentFixture.svelte';
import ConversationFixture from '../../fixtures/ConversationFixture.svelte';
import MessageFixture from '../../fixtures/MessageFixture.svelte';
import PromptComposerFixture from '../../fixtures/PromptComposerFixture.svelte';
import QuestionFixture from '../../fixtures/QuestionFixture.svelte';

function renderBody(component: unknown, props: Record<string, unknown> = {}) {
    return render(component as Component<Record<string, unknown>>, { props }).body;
}

describe('Sivir agent components SSR', () => {
    it('renders Conversation without browser globals', () => {
        expect(() => renderBody(ConversationFixture, { follow: false })).not.toThrow();
        expect(renderBody(ConversationFixture)).toContain('role="log"');
    });

    it('renders Message without throwing', () => {
        expect(() => renderBody(MessageFixture, { status: 'streaming' })).not.toThrow();
        expect(renderBody(MessageFixture)).toContain('Deployment analysis complete.');
    });

    it('renders representative Markdown without throwing', () => {
        const content =
            '# Result\n\n| State |\n| --- |\n| Ready |\n\n```js\nconst ready = true;\n```';
        expect(() => renderBody(Markdown, { content })).not.toThrow();
        expect(renderBody(Markdown, { content })).toContain('Result');
    });

    it('renders PromptComposer without throwing', () => {
        expect(() => renderBody(PromptComposerFixture, { value: 'Server prompt' })).not.toThrow();
        expect(renderBody(PromptComposerFixture, { value: 'Server prompt' })).toContain(
            'Server prompt'
        );
    });

    it('renders Question without browser globals', () => {
        expect(() => renderBody(QuestionFixture, { value: 'safe' })).not.toThrow();
        expect(renderBody(QuestionFixture, { value: 'safe' })).toContain(
            'How should the release be prepared?'
        );
    });

    it('renders an empty Attachment without constructing files', () => {
        expect(() => renderBody(AttachmentFixture)).not.toThrow();
        const body = renderBody(AttachmentFixture);
        expect(body).toContain('data-ui="attachment"');
        expect(body).not.toContain('data-ui="attachment-item"');
    });
});
