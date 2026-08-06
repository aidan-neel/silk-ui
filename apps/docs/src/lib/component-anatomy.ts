import type { components } from './components';

export type ComponentSlug = (typeof components)[number];

export type ComponentPart = {
    name: string;
    description: string;
};

export const componentAnatomy = {
    accordion: [
        { name: 'Accordion.Root', description: 'Groups collapsible sections.' },
        { name: 'Accordion.Item', description: 'Defines a collapsible section.' },
        { name: 'Accordion.Trigger', description: 'Toggles its item.' },
        { name: 'Accordion.Content', description: "Contains an item's collapsible content." }
    ],
    alert: [
        { name: 'Alert.Root', description: 'Provides the alert container.' },
        { name: 'Alert.Title', description: 'Renders the alert heading.' },
        { name: 'Alert.Description', description: 'Renders the alert details.' }
    ],
    'alert-dialog': [
        { name: 'AlertDialog.Root', description: 'Controls alert dialog state.' },
        { name: 'AlertDialog.Trigger', description: 'Opens the alert dialog.' },
        { name: 'AlertDialog.Content', description: 'Renders the dialog surface.' },
        { name: 'AlertDialog.Header', description: 'Groups dialog heading content.' },
        { name: 'AlertDialog.Title', description: 'Renders the dialog title.' },
        { name: 'AlertDialog.Description', description: 'Renders the dialog description.' },
        { name: 'AlertDialog.Exit', description: 'Closes the dialog without confirming.' },
        { name: 'AlertDialog.Footer', description: 'Groups dialog actions.' },
        { name: 'AlertDialog.Confirm', description: 'Confirms and closes the dialog.' }
    ],
    'approval-request': [
        { name: 'ApprovalRequest.Root', description: 'Controls approval request visibility.' },
        { name: 'ApprovalRequest.Content', description: 'Renders the approval request surface.' },
        { name: 'ApprovalRequest.Header', description: 'Groups request summary content.' },
        { name: 'ApprovalRequest.Status', description: 'Displays the request status.' },
        { name: 'ApprovalRequest.Icon', description: 'Displays the request icon.' },
        { name: 'ApprovalRequest.Risk', description: 'Displays the request risk level.' },
        { name: 'ApprovalRequest.Title', description: 'Renders the request title.' },
        { name: 'ApprovalRequest.Description', description: 'Renders the request description.' },
        { name: 'ApprovalRequest.Details', description: 'Displays request details.' },
        { name: 'ApprovalRequest.Footer', description: 'Groups request actions.' },
        { name: 'ApprovalRequest.Cancel', description: 'Cancels and closes the request.' },
        { name: 'ApprovalRequest.Confirm', description: 'Confirms and closes the request.' }
    ],
    attachment: [
        { name: 'Attachment.Root', description: 'Manages selected files.' },
        { name: 'Attachment.Trigger', description: 'Opens the file picker.' },
        { name: 'Attachment.List', description: 'Lists selected files.' },
        { name: 'Attachment.Item', description: 'Displays one selected file.' }
    ],
    avatar: [
        { name: 'Avatar.Root', description: 'Provides the avatar container.' },
        { name: 'Avatar.Image', description: 'Renders the avatar image.' },
        { name: 'Avatar.Fallback', description: 'Renders fallback avatar content.' }
    ],
    badge: [{ name: 'Badge', description: 'Displays a compact status label.' }],
    breadcrumb: [
        { name: 'Breadcrumb.Root', description: 'Provides breadcrumb navigation.' },
        { name: 'Breadcrumb.Item', description: 'Renders a breadcrumb link or item.' },
        { name: 'Breadcrumb.Separator', description: 'Separates breadcrumb items.' }
    ],
    button: [{ name: 'Button', description: 'Triggers an action or navigation.' }],
    card: [
        { name: 'Card.Root', description: 'Provides the card container.' },
        { name: 'Card.Title', description: 'Renders the card heading.' },
        { name: 'Card.Header', description: 'Groups card heading content.' },
        { name: 'Card.Footer', description: 'Groups card actions or metadata.' },
        { name: 'Card.Description', description: 'Renders the card description.' },
        { name: 'Card.Content', description: 'Renders the card body.' }
    ],
    checkbox: [{ name: 'Checkbox', description: 'Selects or clears a boolean value.' }],
    'code-block': [
        { name: 'CodeBlock.Root', description: 'Provides code block state and layout.' },
        { name: 'CodeBlock.Header', description: 'Renders the code block header.' },
        { name: 'CodeBlock.List', description: 'Groups code language tabs.' },
        { name: 'CodeBlock.Trigger', description: 'Selects a code language tab.' },
        { name: 'CodeBlock.Actions', description: 'Groups code block actions.' },
        { name: 'CodeBlock.Copy', description: 'Copies the active code snippet.' },
        { name: 'CodeBlock.Content', description: 'Renders a code snippet panel.' },
        { name: 'CodeBlock', description: 'Renders a high-level code block.' }
    ],
    collapsible: [
        { name: 'Collapsible.Root', description: 'Controls collapsible content state.' },
        { name: 'Collapsible.Trigger', description: 'Toggles the content.' },
        { name: 'Collapsible.Content', description: 'Contains collapsible content.' }
    ],
    'color-picker': [
        { name: 'ColorPicker.Root', description: 'Controls color picker state.' },
        { name: 'ColorPicker.Trigger', description: 'Opens the color picker.' },
        { name: 'ColorPicker.Content', description: 'Renders color selection controls.' }
    ],
    combobox: [
        { name: 'Combobox.Root', description: 'Provides combobox state.' },
        { name: 'Combobox.Content', description: 'Contains combobox controls.' },
        { name: 'Combobox.Trigger', description: 'Opens the combobox.' },
        { name: 'Combobox.Results', description: 'Lists matching items.' },
        { name: 'Combobox.Item', description: 'Defines a selectable item.' },
        { name: 'Combobox.Label', description: 'Labels the combobox.' }
    ],
    command: [
        { name: 'Command.Root', description: 'Provides command menu state.' },
        { name: 'Command.Content', description: 'Contains command menu controls.' },
        { name: 'Command.Trigger', description: 'Opens the command menu.' },
        { name: 'Command.Separator', description: 'Separates command menu items.' },
        { name: 'Command.Results', description: 'Lists matching commands.' },
        { name: 'Command.Search', description: 'Filters command items.' },
        { name: 'Command.Item', description: 'Defines a command action.' },
        { name: 'Command.Group', description: 'Groups command items.' }
    ],
    'context-menu': [
        { name: 'ContextMenu.Root', description: 'Provides context menu state.' },
        { name: 'ContextMenu.Content', description: 'Renders the menu surface.' },
        { name: 'ContextMenu.CheckboxItem', description: 'Renders a checkable menu item.' },
        { name: 'ContextMenu.Item', description: 'Renders a menu action.' },
        { name: 'ContextMenu.Separator', description: 'Separates menu items.' },
        { name: 'ContextMenu.SubContent', description: 'Renders a submenu surface.' },
        { name: 'ContextMenu.SubTrigger', description: 'Opens a submenu.' },
        { name: 'ContextMenu.Sub', description: 'Provides submenu state.' },
        { name: 'ContextMenu.Trigger', description: 'Defines the context menu target.' }
    ],
    conversation: [
        { name: 'Conversation.Root', description: 'Manages transcript scrolling.' },
        { name: 'Conversation.Content', description: 'Contains conversation messages.' },
        { name: 'Conversation.Empty', description: 'Renders an empty conversation state.' },
        { name: 'Conversation.ScrollButton', description: 'Scrolls to the latest message.' }
    ],
    'copy-button': [{ name: 'CopyButton', description: 'Copies text to the clipboard.' }],
    'dropdown-menu': [
        { name: 'DropdownMenu.Root', description: 'Provides dropdown menu state.' },
        { name: 'DropdownMenu.Trigger', description: 'Opens the dropdown menu.' },
        { name: 'DropdownMenu.Label', description: 'Labels a menu section.' },
        { name: 'DropdownMenu.Item', description: 'Renders a menu action.' },
        { name: 'DropdownMenu.Content', description: 'Renders the menu surface.' },
        { name: 'DropdownMenu.Separator', description: 'Separates menu items.' },
        { name: 'DropdownMenu.Sub', description: 'Provides submenu state.' },
        { name: 'DropdownMenu.SubContent', description: 'Renders a submenu surface.' },
        { name: 'DropdownMenu.SubTrigger', description: 'Opens a submenu.' }
    ],
    'fullscreen-nav': [
        { name: 'FullscreenNav.Root', description: 'Controls fullscreen navigation state.' },
        { name: 'FullscreenNav.Trigger', description: 'Opens fullscreen navigation.' },
        { name: 'FullscreenNav.Content', description: 'Renders navigation content.' },
        { name: 'FullscreenNav.Close', description: 'Closes fullscreen navigation.' },
        { name: 'FullscreenNav.Group', description: 'Groups navigation links.' },
        { name: 'FullscreenNav.Link', description: 'Renders a navigation link.' }
    ],
    gauge: [{ name: 'Gauge', description: 'Displays a value as a filled arc.' }],
    'hover-card': [
        { name: 'HoverCard.Root', description: 'Controls hover card state.' },
        { name: 'HoverCard.Trigger', description: 'Opens the hover card.' },
        { name: 'HoverCard.Content', description: 'Renders hover card content.' },
        { name: 'HoverCard.Title', description: 'Renders the hover card title.' },
        { name: 'HoverCard.Description', description: 'Renders the hover card description.' }
    ],
    input: [{ name: 'Input', description: 'Accepts a single-line value.' }],
    label: [{ name: 'Label', description: 'Labels a form control.' }],
    markdown: [{ name: 'Markdown', description: 'Renders GitHub-flavored Markdown.' }],
    message: [
        { name: 'Message.Root', description: 'Provides a conversation message.' },
        { name: 'Message.Content', description: 'Contains message content.' },
        { name: 'Message.Actions', description: 'Groups message actions.' }
    ],
    modal: [
        { name: 'Modal.Root', description: 'Controls modal state.' },
        { name: 'Modal.Trigger', description: 'Opens the modal.' },
        { name: 'Modal.Content', description: 'Renders the modal surface.' },
        { name: 'Modal.Title', description: 'Renders the modal title.' },
        { name: 'Modal.Description', description: 'Renders the modal description.' },
        { name: 'Modal.Header', description: 'Groups modal heading content.' },
        { name: 'Modal.Body', description: 'Renders the modal body.' },
        { name: 'Modal.Close', description: 'Closes the modal.' },
        { name: 'Modal.Footer', description: 'Groups modal actions.' },
        { name: 'Modal.Confirm', description: 'Confirms and closes the modal.' }
    ],
    pagination: [{ name: 'Pagination', description: 'Navigates paginated content.' }],
    popover: [
        { name: 'Popover.Root', description: 'Controls popover state.' },
        { name: 'Popover.Trigger', description: 'Opens the popover.' },
        { name: 'Popover.Content', description: 'Renders the popover surface.' },
        { name: 'Popover.Title', description: 'Renders the popover title.' }
    ],
    progress: [{ name: 'Progress', description: 'Displays progress toward a value.' }],
    'prompt-composer': [
        { name: 'PromptComposer.Root', description: 'Manages prompt submission.' },
        { name: 'PromptComposer.Input', description: 'Accepts the prompt text.' },
        { name: 'PromptComposer.Toolbar', description: 'Groups composer controls.' },
        { name: 'PromptComposer.Actions', description: 'Groups composer actions.' },
        { name: 'PromptComposer.Submit', description: 'Submits or stops the prompt.' }
    ],
    question: [
        { name: 'Question.Root', description: 'Manages answer state and submission.' },
        { name: 'Question.Title', description: 'Labels the question fieldset.' },
        { name: 'Question.Description', description: 'Adds context for the decision.' },
        { name: 'Question.Options', description: 'Groups structured answer choices.' },
        { name: 'Question.Option', description: 'Defines one answer choice.' },
        { name: 'Question.Input', description: 'Accepts a free-text answer.' },
        { name: 'Question.Actions', description: 'Groups question actions.' },
        { name: 'Question.Cancel', description: 'Skips or defers the question.' },
        { name: 'Question.Submit', description: 'Submits the current answer.' }
    ],
    'radio-group': [
        { name: 'RadioGroup.Root', description: 'Manages a single selection.' },
        { name: 'RadioGroup.Item', description: 'Defines a radio option.' }
    ],
    reasoning: [
        { name: 'Reasoning.Root', description: 'Controls reasoning visibility.' },
        { name: 'Reasoning.Trigger', description: 'Toggles reasoning content.' },
        { name: 'Reasoning.Content', description: 'Contains reasoning content.' }
    ],
    'response-stream': [
        { name: 'ResponseStream', description: 'Renders a streamed text response.' }
    ],
    'reorder-list': [
        {
            name: 'ReorderList',
            description: 'Reorders controlled items with pointer or keyboard input.'
        }
    ],
    'scroll-area': [{ name: 'ScrollArea', description: 'Provides a scrollable content area.' }],
    'show-more': [
        { name: 'ShowMore', description: 'Clamps long content and expands it on demand.' }
    ],
    select: [
        { name: 'Select.Root', description: 'Provides select state.' },
        { name: 'Select.Trigger', description: 'Opens the select menu.' },
        { name: 'Select.Value', description: 'Displays the selected value.' },
        { name: 'Select.Label', description: 'Labels a select section.' },
        { name: 'Select.Item', description: 'Defines a selectable option.' },
        { name: 'Select.Content', description: 'Renders select options.' }
    ],
    sheet: [
        { name: 'Sheet.Root', description: 'Controls sheet state.' },
        { name: 'Sheet.Trigger', description: 'Opens the sheet.' },
        { name: 'Sheet.Title', description: 'Renders the sheet title.' },
        { name: 'Sheet.Header', description: 'Groups sheet heading content.' },
        { name: 'Sheet.Footer', description: 'Groups sheet actions.' },
        { name: 'Sheet.Description', description: 'Renders the sheet description.' },
        { name: 'Sheet.Content', description: 'Renders the sheet surface.' },
        { name: 'Sheet.Close', description: 'Closes the sheet.' }
    ],
    shortcut: [{ name: 'Shortcut', description: 'Displays a keyboard shortcut.' }],
    skeleton: [
        { name: 'Skeleton', description: 'Displays a static loading placeholder.' },
        { name: 'SkeletonSwap', description: 'Swaps a delayed placeholder into reserved content.' }
    ],
    slider: [{ name: 'Slider', description: 'Selects a numeric value from a range.' }],
    spinner: [{ name: 'Spinner', description: 'Indicates loading activity.' }],
    switch: [{ name: 'Switch', description: 'Toggles a boolean value.' }],
    'task-steps': [{ name: 'TaskSteps', description: 'Narrates ordered asynchronous work.' }],
    tabs: [
        { name: 'Tabs.Root', description: 'Manages active tab state.' },
        { name: 'Tabs.List', description: 'Groups tab triggers.' },
        { name: 'Tabs.Trigger', description: 'Selects a tab panel.' },
        { name: 'Tabs.Content', description: 'Renders a tab panel.' }
    ],
    textarea: [{ name: 'Textarea', description: 'Accepts a multi-line value.' }],
    toast: [
        { name: 'Toast', description: 'Renders a notification.' },
        { name: 'Toaster', description: 'Renders the notification region.' }
    ],
    toggle: [{ name: 'Toggle', description: 'Toggles a pressed state.' }],
    'toggle-group': [
        { name: 'ToggleGroup.Root', description: 'Manages toggle group selection.' },
        { name: 'ToggleGroup.Item', description: 'Defines a toggle group option.' }
    ],
    tool: [
        { name: 'Tool.Root', description: 'Provides a tool execution summary.' },
        { name: 'Tool.Item', description: 'Displays one tool call.' },
        { name: 'Tool.Input', description: 'Displays tool input.' },
        { name: 'Tool.Output', description: 'Displays tool output.' }
    ],
    toolbar: [{ name: 'Toolbar', description: 'Groups related controls.' }],
    tooltip: [
        { name: 'Tooltip.Root', description: 'Controls tooltip state.' },
        { name: 'Tooltip.Content', description: 'Renders tooltip content.' },
        { name: 'Tooltip.Trigger', description: 'Opens the tooltip.' }
    ]
} satisfies Record<ComponentSlug, ComponentPart[]>;
