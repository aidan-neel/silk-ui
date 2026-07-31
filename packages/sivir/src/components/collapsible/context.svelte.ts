import { createContext } from '@sivir-ui/svelte/utils';
import type { CollapsibleState } from '.';

export type CollapsibleContext = {
	id: string;
	state: CollapsibleState;
};

const { set: setCollapsibleContext, get: getCollapsibleContext } =
	createContext<CollapsibleContext>('collapsible');

export { setCollapsibleContext, getCollapsibleContext };
