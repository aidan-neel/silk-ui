import Spinner from './spinner.svelte';

export type SpinnerProps = {
    size?: number;
    ready?: boolean;
    class?: string;
    'aria-label'?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
};

export { Spinner };
