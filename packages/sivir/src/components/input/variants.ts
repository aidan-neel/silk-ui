import { tv } from 'tailwind-variants';

export const input = tv({
    base: 'flex min-h-[var(--size-control-md)] w-full rounded-[var(--radius-lg)] border border-border bg-[var(--color-field)] px-3 py-0 text-[var(--color-field-foreground)] [font-size:var(--font-size-body)] transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] file:border-0 file:bg-transparent file:[font-weight:var(--font-weight-body)] file:[font-size:var(--font-size-body)] file:[letter-spacing:var(--tracking-body)] file:text-foreground',

    variants: {
        variant: {
            outline:
                'border-[var(--color-input)] bg-[var(--color-field)] focus-visible:shadow-[var(--focus-ring)]',
            secondary:
                'border-transparent bg-secondary focus-visible:border-[color-mix(in_srgb,var(--color-secondary)_45%,var(--color-primary))] focus-visible:shadow-[var(--focus-ring)]'
        }
    },
    defaultVariants: {
        variant: 'outline'
    }
});
