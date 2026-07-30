import { createContext } from '@sivir/ui/utils';
import type { PopoverState } from '.';

export type PopoverContext = {
	id: string;
	state: PopoverState;
};

const { set: setPopoverContext, get: getPopoverContext } = createContext<PopoverContext>('popover');

export { setPopoverContext, getPopoverContext };
