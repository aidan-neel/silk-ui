import type { PopoverState } from '.';
export type PopoverContext = {
    id: string;
    state: PopoverState;
};
declare const setPopoverContext: (value: PopoverContext) => PopoverContext, getPopoverContext: () => PopoverContext;
export { getPopoverContext, setPopoverContext };
