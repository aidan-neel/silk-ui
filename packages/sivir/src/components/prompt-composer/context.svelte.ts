import { createContext } from '@sivir-ui/svelte/utils';
import type { PromptComposerStatus } from '.';

export type PromptComposerContext = {
    value: string;
    readonly status: PromptComposerStatus;
    readonly disabled: boolean;
    readonly allowEmpty: boolean;
    submit: () => void;
    stop: () => void;
};

const { set: setPromptComposerContext, get: getPromptComposerContext } =
    createContext<PromptComposerContext>('prompt-composer');

export { setPromptComposerContext, getPromptComposerContext };
