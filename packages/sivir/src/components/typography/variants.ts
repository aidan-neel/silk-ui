export const titleClasses =
    'font-[family-name:var(--font-header)] text-[length:var(--font-size-header,16px)] font-[var(--font-weight-header,600)] tracking-[var(--tracking-header,-0.015em)] leading-snug text-balance text-foreground';

export const descriptionClasses =
    'text-[length:var(--font-size-body,14px)] font-[var(--font-weight-description,400)] tracking-[var(--tracking-body,0em)] leading-relaxed text-pretty text-foreground-muted';

export const metadataClasses =
    'text-[length:var(--text-xs,12px)] font-[var(--font-weight-body,400)] tracking-[var(--tracking-body,0em)] leading-normal text-foreground-muted';

const documentHeadingClasses = 'font-[family-name:var(--font-header)] text-balance text-foreground';

export const h1Classes = `${documentHeadingClasses} text-3xl font-[var(--font-weight-header,600)] tracking-[var(--tracking-header,-0.02em)] leading-tight`;

export const h2Classes = `${documentHeadingClasses} text-xl font-[var(--font-weight-header,600)] tracking-[var(--tracking-header,-0.015em)] leading-[1.3]`;

export const h3Classes = `${documentHeadingClasses} text-base font-[var(--font-weight-header,600)] tracking-[var(--tracking-header,-0.015em)] leading-[1.2]`;

export const h4Classes = `${documentHeadingClasses} text-[length:var(--font-size-body,14px)] font-semibold tracking-[var(--tracking-body,0em)] leading-snug`;

export const h5Classes =
    'font-[family-name:var(--font-header)] text-[length:var(--font-size-body,14px)] font-semibold tracking-[var(--tracking-body,0em)] leading-snug text-balance text-foreground-muted';

export const h6Classes =
    'font-[family-name:var(--font-header)] text-[length:var(--font-size-body,14px)] font-medium tracking-[var(--tracking-body,0em)] leading-snug text-balance text-foreground-muted';

export const textClasses = {
    lead: 'text-base font-[var(--font-weight-description,400)] tracking-[var(--tracking-body,0em)] leading-relaxed text-pretty text-foreground-muted',
    body: 'text-base font-[var(--font-weight-body,400)] tracking-[var(--tracking-body,0em)] leading-relaxed text-pretty text-foreground',
    supporting:
        'text-[length:var(--font-size-body,14px)] font-[var(--font-weight-body,400)] tracking-[var(--tracking-body,0em)] leading-relaxed text-pretty text-foreground-muted'
} as const;

export const inlineCodeClasses =
    // token-lint-disable-next-line no-literal-length: inline code scales with surrounding text
    'rounded-[var(--radius-sm)] bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-foreground [box-decoration-break:clone] [overflow-wrap:anywhere]';
