import type { ComboboxState } from '.';
export type ComboboxContext = {
    id: string;
    state: ComboboxState;
};
declare const setComboboxContext: (value: ComboboxContext) => ComboboxContext, getComboboxContext: () => ComboboxContext;
export { setComboboxContext, getComboboxContext };
