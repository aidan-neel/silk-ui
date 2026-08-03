import { tv } from 'tailwind-variants';

export const badge = tv({
    base: 'flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-[var(--sivir-space-2)] py-1 [font-size:var(--font-size-badge,12px)] leading-[1.2] [font-weight:var(--font-weight-badge,500)] [letter-spacing:var(--tracking-badge,0em)] transition-[background-color,border-color,color] [transition-duration:var(--motion-duration-hover)] ease-in-out motion-reduce:transition-none hover:cursor-default disabled:cursor-not-allowed disabled:opacity-50', // token-lint-disable-line no-literal-length,no-primitive-leak

    variants: {
        variant: {
            primary: 'bg-primary text-[var(--color-on-primary)]',
            secondary: 'bg-secondary text-foreground',
            ghost: 'bg-transparent text-foreground hover:bg-[color-mix(in_srgb,var(--color-foreground)_6%,transparent)]',
            outline: 'border border-border bg-transparent text-foreground',
            destructive:
                'bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-[var(--color-error)]',
            info: 'bg-[color-mix(in_srgb,var(--color-info)_12%,transparent)] text-[var(--color-info)]',
            success:
                'bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]',
            warning:
                'bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-[var(--color-warning)]',
            error: 'bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-[var(--color-error)]'
        }
    },
    defaultVariants: {
        variant: 'secondary'
    }
});
