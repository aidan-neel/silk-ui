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
    'context-menu',
    'conversation',
    'copy-button',
    'dropdown-menu',
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
    'prompt-composer',
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
    'task-steps',
    'textarea',
    'toast',
    'toggle',
    'toggle-group',
    'tool',
    'toolbar',
    'tooltip'
] as const;

export const sanitizeComponent = (name: string) => {
    if (name === 'prompt-composer') {
        return 'Composer';
    }

    return name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
