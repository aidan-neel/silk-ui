import { createContext } from '@sivir-ui/svelte/utils';
import type { ApprovalRequestActionName, ApprovalRisk } from '.';

export type ApprovalRequestContext = {
    get risk(): ApprovalRisk;
    get open(): boolean;
    get pending(): ApprovalRequestActionName | null;
    get error(): string | null;
    runAction: (
        name: ApprovalRequestActionName,
        handler: ((event: MouseEvent) => unknown | Promise<unknown>) | undefined,
        event: MouseEvent,
        failureMessage?: string
    ) => void;
};

const { set: setApprovalRequestContext, get: getApprovalRequestContext } =
    createContext<ApprovalRequestContext>('approval-request');

export { getApprovalRequestContext, setApprovalRequestContext };
