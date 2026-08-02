import type { ApprovalRequestActionName, ApprovalRisk } from '.';
export type ApprovalRequestContext = {
    get risk(): ApprovalRisk;
    get open(): boolean;
    get pending(): ApprovalRequestActionName | null;
    get error(): string | null;
    runAction: (name: ApprovalRequestActionName, handler: ((event: MouseEvent) => unknown | Promise<unknown>) | undefined, event: MouseEvent, failureMessage?: string) => void;
};
declare const setApprovalRequestContext: (value: ApprovalRequestContext) => ApprovalRequestContext, getApprovalRequestContext: () => ApprovalRequestContext;
export { getApprovalRequestContext, setApprovalRequestContext };
