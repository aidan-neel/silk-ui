import { createContext } from '@sivir-ui/svelte/utils';

export type ReasoningContext = {
    id: string;
    get open(): boolean;
    set open(value: boolean);
    get streaming(): boolean;
    registerContent: () => () => void;
    transitionStart: (open: boolean) => number;
    transitionComplete: (open: boolean, revision: number) => void;
};

const { set: setReasoningContext, get: getReasoningContext } =
    createContext<ReasoningContext>('reasoning');

export { getReasoningContext, setReasoningContext };
