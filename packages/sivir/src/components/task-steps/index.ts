import type { HTMLAttributes } from 'svelte/elements';
import TaskSteps from './task-steps.svelte';

export type TaskStep = {
    id: string;
    label: string;
    meta?: string;
};

export type TaskStepStatus = 'pending' | 'active' | 'done' | 'error';

export type TaskStepsProps = {
    steps: TaskStep[];
    current: number;
    failed?: boolean;
    label?: string;
    class?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export { TaskSteps };
export default TaskSteps;
