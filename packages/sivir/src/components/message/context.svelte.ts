import { createContext } from '@sivir-ui/svelte/utils';
import type { MessageFrom, MessageStatus } from '.';

export type MessageContext = {
	get from(): MessageFrom;
	get status(): MessageStatus;
};

const { set: setMessageContext, get: getMessageContext } = createContext<MessageContext>('message');

export { getMessageContext, setMessageContext };
