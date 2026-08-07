import type { SelectState } from '.';
export type SelectContext = {
    id: string;
    state: SelectState;
    /** Plain registries — never put these inside $state. */
    labels: Map<string, string>;
    values: Set<string>;
};
declare const setSelectContext: (value: SelectContext) => SelectContext,
    getSelectContext: () => SelectContext;
export { setSelectContext, getSelectContext };
