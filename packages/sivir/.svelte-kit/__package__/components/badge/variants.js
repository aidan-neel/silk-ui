import { tv } from 'tailwind-variants';
export const badge = tv({
    base: 'flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-2 py-1 [font-size:var(--font-size-badge)] leading-tight [font-weight:var(--font-weight-badge)] [letter-spacing:var(--tracking-badge)] transition-[background-color,border-color,color] [transition-duration:var(--motion-duration-hover)] ease-in-out motion-reduce:transition-none hover:cursor-default disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
    variants: {
        variant: {
            primary: 'bg-primary text-[var(--color-on-primary)]',
            secondary: 'bg-secondary text-foreground',
            ghost: 'bg-transparent text-foreground hover:bg-[color-mix(in_srgb,var(--color-foreground)_6%,transparent)]',
            outline: 'border border-border bg-transparent text-foreground',
            destructive: 'bg-error-soft text-[var(--color-error)]',
            info: 'bg-info-soft text-[var(--color-info)]',
            success: 'bg-success-soft text-[var(--color-success)]',
            warning: 'bg-warning-soft text-[var(--color-warning)]',
            error: 'bg-error-soft text-[var(--color-error)]'
        }
    },
    defaultVariants: {
        variant: 'secondary'
    }
});
