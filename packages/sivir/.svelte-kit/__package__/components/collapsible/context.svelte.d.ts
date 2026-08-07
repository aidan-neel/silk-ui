import type { CollapsibleState } from '.';
export type CollapsibleContext = {
    id: string;
    state: CollapsibleState;
};
declare const setCollapsibleContext: (value: CollapsibleContext) => CollapsibleContext,
    getCollapsibleContext: () => CollapsibleContext;
export { setCollapsibleContext, getCollapsibleContext };
