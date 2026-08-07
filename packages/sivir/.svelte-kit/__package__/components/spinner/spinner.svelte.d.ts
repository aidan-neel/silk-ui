type SpinnerProps = {
    size?: number;
    ready?: boolean;
    class?: string;
    'aria-label'?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
};
declare const Spinner: import("svelte").Component<SpinnerProps, {}, "">;
type Spinner = ReturnType<typeof Spinner>;
export default Spinner;
