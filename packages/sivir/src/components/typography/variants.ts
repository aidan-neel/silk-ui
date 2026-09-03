export const titleClasses =
    'font-[family-name:var(--font-header)] text-[length:var(--font-size-header)] font-[var(--font-weight-header)] tracking-[var(--tracking-header)] leading-snug text-balance text-foreground';

export const descriptionClasses =
    'text-[length:var(--font-size-body)] font-[var(--font-weight-description)] tracking-[var(--tracking-body)] leading-relaxed text-pretty text-foreground-muted';

export const metadataClasses =
    'text-[length:var(--text-xs)] font-[var(--font-weight-body)] tracking-[var(--tracking-body)] leading-normal text-foreground-muted';

const documentHeadingClasses = 'font-[family-name:var(--font-header)] text-balance text-foreground';

export const h1Classes = `${documentHeadingClasses} text-3xl font-[var(--font-weight-header)] tracking-[var(--tracking-header)] leading-tight`;

export const h2Classes = `${documentHeadingClasses} text-xl font-[var(--font-weight-header)] tracking-[var(--tracking-header)] leading-label`;

export const h3Classes = `${documentHeadingClasses} text-base font-[var(--font-weight-header)] tracking-[var(--tracking-header)] leading-tight`;

export const h4Classes = `${documentHeadingClasses} text-[length:var(--font-size-body)] [font-weight:var(--font-weight-header)] tracking-[var(--tracking-body)] leading-snug`;

export const h5Classes =
    'font-[family-name:var(--font-header)] text-[length:var(--font-size-body)] [font-weight:var(--font-weight-header)] tracking-[var(--tracking-body)] leading-snug text-balance text-foreground-muted';

export const h6Classes =
    'font-[family-name:var(--font-header)] text-[length:var(--font-size-body)] font-label tracking-[var(--tracking-body)] leading-snug text-balance text-foreground-muted';

export const textClasses = {
    lead: 'text-base font-[var(--font-weight-description)] tracking-[var(--tracking-body)] leading-relaxed text-pretty text-foreground-muted',
    body: 'text-base font-[var(--font-weight-body)] tracking-[var(--tracking-body)] leading-relaxed text-pretty text-foreground',
    supporting:
        'text-[length:var(--font-size-body)] font-[var(--font-weight-body)] tracking-[var(--tracking-body)] leading-relaxed text-pretty text-foreground-muted'
} as const;

export const inlineCodeClasses =
    // token-lint-disable-next-line no-literal-length: inline code scales with surrounding text
    'rounded-[var(--radius-sm)] bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-foreground [box-decoration-break:clone] [overflow-wrap:anywhere]';
