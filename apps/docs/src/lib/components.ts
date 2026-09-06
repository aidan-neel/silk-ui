export const components = [
    'accordion',
    'alert',
    'alert-dialog',
    'attachment',
    'avatar',
    'badge',
    'breadcrumb',
    'button',
    'card',
    'checkbox',
    'code-block',
    'collapsible',
    'color-picker',
    'combobox',
    'command',
    'composer',
    'context-menu',
    'conversation',
    'copy-button',
    'dropdown-menu',
    'file-diff',
    'fullscreen-nav',
    'gauge',
    'hover-card',
    'input',
    'label',
    'markdown',
    'message',
    'modal',
    'pagination',
    'popover',
    'progress',
    'question',
    'radio-group',
    'reasoning',
    'reorder-list',
    'response-stream',
    'scroll-area',
    'select',
    'sheet',
    'shortcut',
    'show-more',
    'skeleton',
    'slider',
    'spinner',
    'switch',
    'tabs',
    'tag-input',
    'task-steps',
    'textarea',
    'toast',
    'toggle',
    'toggle-group',
    'tool',
    'toolbar',
    'tooltip',
    'typography'
] as const;

export const sanitizeComponent = (name: string) => {
    if (name === 'composer') {
        return 'Composer';
    }

    return name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
