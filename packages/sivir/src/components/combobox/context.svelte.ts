import { createContext } from '@sivir/ui/utils';
import type { ComboboxState } from '.';

export type ComboboxContext = {
	id: string;
	placeholder: string;
	state: ComboboxState;
};

const { set: setComboboxContext, get: getComboboxContext } =
	createContext<ComboboxContext>('combobox');

export { setComboboxContext, getComboboxContext };
