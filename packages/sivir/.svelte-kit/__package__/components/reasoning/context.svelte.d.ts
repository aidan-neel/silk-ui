export type ReasoningContext = {
    id: string;
    get open(): boolean;
    set open(value: boolean);
    get streaming(): boolean;
    registerContent: () => () => void;
    transitionStart: (open: boolean) => number;
    transitionComplete: (open: boolean, revision: number) => void;
};
declare const setReasoningContext: (value: ReasoningContext) => ReasoningContext, getReasoningContext: () => ReasoningContext;
export { getReasoningContext, setReasoningContext };
