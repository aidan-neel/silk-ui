import type { PromptComposerStatus } from '.';
export type PromptComposerContext = {
    value: string;
    readonly status: PromptComposerStatus;
    readonly disabled: boolean;
    readonly allowEmpty: boolean;
    submit: () => void;
    stop: () => void;
};
declare const setPromptComposerContext: (value: PromptComposerContext) => PromptComposerContext, getPromptComposerContext: () => PromptComposerContext;
export { setPromptComposerContext, getPromptComposerContext };
