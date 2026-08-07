export type ConversationContext = {
    get follow(): boolean;
    set follow(value: boolean);
    get threshold(): number;
    get atBottom(): boolean;
    set atBottom(value: boolean);
    get scrollingToBottom(): boolean;
    set scrollingToBottom(value: boolean);
    get viewport(): HTMLDivElement | undefined;
    set viewport(value: HTMLDivElement | undefined);
    scrollToBottom: (behavior?: ScrollBehavior) => void;
};
declare const setConversationContext: (value: ConversationContext) => ConversationContext, getConversationContext: () => ConversationContext;
export { getConversationContext, setConversationContext };
