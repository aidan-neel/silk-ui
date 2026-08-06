import { createContext } from '@sivir-ui/svelte/utils';

export type DropdownMenuRadioGroupContext = {
    get value(): string | undefined;
    set value(value: string | undefined);
    onValueChange?: (value: string) => void;
};

const { set: setDropdownMenuRadioGroupContext, get: getDropdownMenuRadioGroupContext } =
    createContext<DropdownMenuRadioGroupContext>('dropdown-menu-radio-group');

export { getDropdownMenuRadioGroupContext, setDropdownMenuRadioGroupContext };
