import { createContext } from '@sivir-ui/svelte/utils';
import type { ComposerStatus } from '.';

export type ComposerContext = {
    value: string;
    readonly status: ComposerStatus;
    readonly disabled: boolean;
    readonly allowEmpty: boolean;
    readonly generating: boolean | undefined;
    readonly pending: boolean;
    submit: () => void;
    stop: () => void;
};

const { set: setComposerContext, get: getComposerContext } =
    createContext<ComposerContext>('composer');

export { getComposerContext, setComposerContext };
