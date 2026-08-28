# Sivir Component Selection

Use this guide to narrow candidates, then read each candidate's current Markdown page from `https://sivir.dev/llms.txt` before writing code.

## Choose by Job

| User need | Start with | Notes |
| --- | --- | --- |
| Trigger an action or navigate | Button | Use a real link destination through the documented link behavior. Reserve icon-only actions for recognizable icons with accessible names. |
| Toggle one setting | Switch or Toggle | Use Switch for an on/off setting; use Toggle for a pressed tool or display mode. |
| Choose one visible option | Radio Group | Best when comparing a small set benefits from seeing every choice. |
| Choose from a compact list | Select | Use for a bounded single-select list that does not need search. |
| Search and choose an option | Combobox | Use for larger or fuzzy-searchable option sets. |
| Run or discover commands | Command | Use for an application command palette, not ordinary form selection. |
| Show contextual actions | Dropdown Menu or Context Menu | Dropdown Menu has an explicit trigger; Context Menu is secondary pointer context and needs another accessible path. |
| Collect short or long text | Input or Textarea | Use the component's integrated label, description, and validation API when available. |
| Confirm a consequential action | Alert Dialog | Use Modal for general tasks; reserve Alert Dialog for decisions that need explicit interruption and confirmation. |
| Complete a focused task in place | Modal | Use Sheet when preserving more page context or a side-oriented workflow matters. |
| Show anchored supplemental UI | Popover or Hover Card | Popover is interactive; Hover Card is preview information and must not hold essential actions. |
| Communicate persistent inline state | Alert | Keep it next to the content or action it qualifies. |
| Confirm a transient action | Toast | Do not use a toast for errors or decisions that require immediate action. |
| Show determinate work | Progress, Gauge, or Task Steps | Progress shows completion, Gauge emphasizes a measured value, and Task Steps names ordered workflow stages. |
| Show indeterminate work | Spinner or Skeleton | Spinner marks compact activity; Skeleton reserves the shape of incoming content. |
| Organize related content | Card | Use only when a surface communicates a real grouping or interactive object better than spacing. |
| Reveal optional detail | Collapsible, Accordion, or Show More | Collapsible controls one region, Accordion manages peer sections, and Show More clamps long prose. |
| Navigate peers or hierarchy | Tabs, Breadcrumb, Pagination, or Fullscreen Nav | Match the information model; do not use Tabs as a generic layout switch when controls or links are more accurate. |

## Compose AI Interfaces

Treat the AI surface as a system of independently meaningful states.

| Concern | Component | Role |
| --- | --- | --- |
| Scrollable transcript | Conversation | Manages following, empty content, transcript layout, and jump-to-latest behavior. |
| Speaker and response state | Message | Marks user, assistant, or system content and exposes streaming or error state plus contextual actions. |
| Rich answer content | Markdown or Code Block | Render structured model output and code rather than rebuilding prose styles per message. |
| Generated text arrival | Response Stream | Use for a string or async chunks when its entrance modes add useful continuity. Prefer direct rendering for already-streamed content when extra animation would delay reading. |
| Model trace | Reasoning | Exposes concise status and optional detail. Keep the collapsed title informative; do not dump an unstructured internal monologue. |
| Agent operations | Tool | Groups running, completed, or failed commands, searches, reads, inputs, and outputs without making each operation a full message. |
| User prompt | Prompt Composer | Owns the controlled prompt value, submission state, toolbar, actions, and send/stop behavior. |
| Agent clarification | Question | Uses single-choice, multiple-choice, or free-text answers with explicit submit and cancel behavior. |
| Ordered execution | Task Steps | Shows stable workflow stages and the current or failed step. |
| Files and artifacts | Attachment | Presents attached inputs or outputs with the component's documented status and actions. |

A common coding-agent composition is:

```text
Conversation.Root
├── Conversation.Content
│   ├── Message.Root from="user"
│   └── Message.Root from="assistant"
│       └── Reasoning / Tool / Markdown / CodeBlock
└── Conversation.ScrollButton

Question.Root or PromptComposer.Root
```

Render `Question` as a temporary takeover when the agent cannot continue without structured input; preserve an unsent composer draft. Keep `Tool` and `Reasoning` lower emphasis than the answer. Use `Message.Actions` for response-scoped actions such as copy, retry, or feedback.

## Resolve Common Ambiguities

| Choice | Decision |
| --- | --- |
| Modal vs Alert Dialog | Modal supports a task; Alert Dialog blocks on a consequential decision. |
| Modal vs Sheet | Modal concentrates attention; Sheet preserves more spatial relationship to the page. |
| Select vs Combobox | Select is compact lookup; Combobox adds search. |
| Combobox vs Command | Combobox produces a field value; Command invokes application actions. |
| Alert vs Toast | Alert persists in context; Toast is transient confirmation. |
| Spinner vs Skeleton | Spinner indicates activity; Skeleton reserves content geometry. |
| Progress vs Task Steps | Progress communicates amount; Task Steps communicates sequence and stage identity. |
| Toggle vs Checkbox | Toggle changes a tool or view's pressed state; Checkbox selects a form option. |
| Accordion vs Tabs | Accordion reveals sections in one reading flow; Tabs switch among peer views. |
| Card vs plain layout | Use Card only when the boundary itself explains grouping, interaction, or state. |

Do not choose a component by visual resemblance alone. Match semantics, state ownership, keyboard behavior, and content structure first.
