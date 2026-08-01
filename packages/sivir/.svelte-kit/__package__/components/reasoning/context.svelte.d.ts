export type ReasoningContext = {
    id: string;
    get open(): boolean;
    set open(value: boolean);
    get streaming(): boolean;
};
declare const setReasoningContext: (value: ReasoningContext) => ReasoningContext, getReasoningContext: () => ReasoningContext;
export { getReasoningContext, setReasoningContext };
