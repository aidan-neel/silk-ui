import { tv } from 'tailwind-variants';

export const input = tv({
    base: 'flex min-h-[var(--size-control-md)] w-full rounded-[var(--radius-lg)] border border-border bg-[var(--color-field)] px-[var(--sivir-space-3)] py-0 text-base text-[var(--color-field-foreground)] [font-size:var(--font-size-body)] transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-[0.55] file:border-0 file:bg-transparent file:text-sm file:[font-weight:var(--font-weight-body,400)] file:[font-size:var(--font-size-body,16px)] file:[letter-spacing:var(--tracking-body,0em)] file:text-foreground md:text-sm', // token-lint-disable-line no-literal-length,no-primitive-leak

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
