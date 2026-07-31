import { createContext } from '@sivir-ui/svelte/utils';
import type { ContextMenuState } from '.';

export type ContextMenuContext = {
	state: ContextMenuState;
	/** Open menu layers from root → immediate parent (submenu cone ancestors). */
	ancestors: ContextMenuState[];
};

const { set: setContextMenuContext, get: getContextMenuContext } =
	createContext<ContextMenuContext>('context-menu');

export { setContextMenuContext, getContextMenuContext };
