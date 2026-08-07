import type { ContextMenuState } from '.';
export type ContextMenuContext = {
    state: ContextMenuState;
    /** Open menu layers from root → immediate parent (submenu cone ancestors). */
    ancestors: ContextMenuState[];
};
declare const setContextMenuContext: (value: ContextMenuContext) => ContextMenuContext,
    getContextMenuContext: () => ContextMenuContext;
export { setContextMenuContext, getContextMenuContext };
