import { createContext } from '@sivir-ui/svelte/utils';
import type { ComboboxState } from '.';

export type ComboboxContext = {
    id: string;
    state: ComboboxState;
};

const { set: setComboboxContext, get: getComboboxContext } =
    createContext<ComboboxContext>('combobox');

export { setComboboxContext, getComboboxContext };
