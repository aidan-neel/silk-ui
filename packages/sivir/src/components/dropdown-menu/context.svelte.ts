import { createContext } from '@sivir-ui/svelte/utils';
import type { PopoverState } from '@sivir-ui/svelte/components/popover';

export type DropdownMenuContext = {
	inverted: boolean;
	/** Open menu layers from root → immediate parent (submenu cone ancestors). */
	ancestors: PopoverState[];
};

const { set: setDropdownMenuContext, get: getDropdownMenuContext } =
	createContext<DropdownMenuContext>('dropdown-menu');

export { setDropdownMenuContext, getDropdownMenuContext };
