import type { MessageFrom, MessageStatus } from '.';
export type MessageContext = {
    get from(): MessageFrom;
    get status(): MessageStatus;
};
declare const setMessageContext: (value: MessageContext) => MessageContext, getMessageContext: () => MessageContext;
export { getMessageContext, setMessageContext };
