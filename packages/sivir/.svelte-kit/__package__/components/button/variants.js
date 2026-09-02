import { tv } from 'tailwind-variants';
export const button = tv({
    base: 'sivir-press inline-flex h-[calc(var(--size-control-md)-var(--size-hairline))] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-2 whitespace-nowrap select-none rounded-[var(--radius-lg)] px-[calc(var(--spacing)*3+var(--size-hairline))] [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] leading-none antialiased transition-[background-color,border-color,color,box-shadow,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] aria-disabled:cursor-default [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
    variants: {
        variant: {
            /**
             * `data-[state=open]` mirrors the hover fill on every variant so a
             * popover or menu trigger reads as hovered for as long as its surface
             * is open.
             */
            primary: 'bg-primary text-[var(--color-on-primary)] shadow-[inset_0_0_0_var(--border-size)_var(--color-primary-stroke)] hover:bg-[var(--color-primary-hover)] data-[state=open]:bg-[var(--color-primary-hover)]',
            secondary: 'bg-secondary text-foreground hover:bg-[color-mix(in_srgb,var(--color-secondary)_92%,black)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-secondary)_92%,black)]',
            ghost: 'bg-transparent text-foreground hover:bg-foreground/[0.08] data-[state=open]:bg-foreground/[0.08]',
            quiet: 'bg-transparent text-foreground',
            /**
             * Outline keeps the soft raised shadow. Focus composes the ring on top
             * of the lift so the raised look survives focus.
             */
            outline: 'bg-card text-foreground shadow-[var(--elevation-button-outline)] hover:bg-secondary data-[state=open]:bg-secondary focus-visible:shadow-[var(--focus-ring),var(--elevation-button-outline)]',
            destructive: 'bg-error-soft text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)]',
            /**
             * A clickable Panel: the same interaction as `outline` wearing Panel's
             * concentric frame -- the semantic border outside and the inset surface
             * ring inside read as Panel's double edge.
             */
            panel: 'border border-border bg-card text-foreground shadow-[var(--elevation-1)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--color-border)_50%,transparent)] hover:bg-muted data-[state=open]:bg-muted focus-visible:shadow-[var(--focus-ring),var(--elevation-1)]'
        },
        size: {
            sm: 'h-[calc(var(--size-control-sm)-var(--size-hairline))] px-[calc(var(--spacing)*3+var(--size-hairline)/4)]',
            md: 'h-[calc(var(--size-control-md)-var(--size-hairline))]',
            lg: 'h-[calc(var(--size-control-lg)-var(--size-hairline))] px-4',
            icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md'
    }
});
