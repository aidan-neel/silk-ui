const TAG = 'sivir-complete-generator';
const NAMES = [
	'Accordion',
	'Alert',
	'Alert Dialog',
	'Approval Request',
	'Attachment',
	'Avatar',
	'Badge',
	'Breadcrumb',
	'Button',
	'Card',
	'Checkbox',
	'Code Block',
	'Collapsible',
	'Color Picker',
	'Combobox',
	'Command',
	'Context Menu',
	'Conversation',
	'Copy Button',
	'Dropdown Menu',
	'Fullscreen Nav',
	'Hover Card',
	'Input',
	'Label',
	'Markdown',
	'Message',
	'Modal',
	'Pagination',
	'Popover',
	'Progress',
	'Prompt Composer',
	'Radio Group',
	'Reasoning',
	'Response Stream',
	'Scroll Area',
	'Select',
	'Sheet',
	'Shortcut',
	'Skeleton',
	'Slider',
	'Spinner',
	'Switch',
	'Tabs',
	'Textarea',
	'Toast',
	'Toggle',
	'Toggle Group',
	'Tool',
	'Toolbar',
	'Tooltip'
];
const H = {
	bg: '#fdfdfc',
	card: '#ffffff',
	muted: '#f8f8f5',
	secondary: '#f0f0ed',
	border: '#e8e8e3',
	strong: '#d4d4ce',
	fg: '#1d1d1a',
	sub: '#6e6e68',
	primary: '#1f9be6',
	hover: '#1270ad',
	tint: '#eef4ff',
	success: '#43a66f',
	warning: '#c98a2b',
	error: '#d05050',
	info: '#4a9eff',
	tooltip: '#1d1d1a'
};
let vars = new Map();

function color(hex, alpha) {
	const value = hex.replace('#', '');
	const rgb =
		value.length === 3
			? value
					.split('')
					.map((x) => x + x)
					.join('')
			: value.slice(0, 6);
	const embedded = value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1;
	return {
		r: parseInt(rgb.slice(0, 2), 16) / 255,
		g: parseInt(rgb.slice(2, 4), 16) / 255,
		b: parseInt(rgb.slice(4, 6), 16) / 255,
		a: alpha === undefined ? embedded : alpha
	};
}
function paint(hex, alpha) {
	const c = color(hex, alpha);
	return { type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a };
}
function tagged(node) {
	node.setPluginData(TAG, '1');
	return node;
}

async function collection(name) {
	const all = await figma.variables.getLocalVariableCollectionsAsync();
	let c = all.find((x) => x.name === name);
	if (!c) c = figma.variables.createVariableCollection(name);
	const mode = c.modes[0].modeId;
	if (c.modes[0].name !== 'Value') c.renameMode(mode, 'Value');
	return [c, mode];
}
async function variable(c, mode, name, type, value, css, scopes) {
	const all = await figma.variables.getLocalVariablesAsync(type);
	let v = all.find((x) => x.variableCollectionId === c.id && x.name === name);
	if (!v) v = figma.variables.createVariable(name, c, type);
	try {
		v.scopes = scopes || [];
	} catch (_e) {}
	v.description = 'Sivir UI token ' + (css || name);
	v.setValueForMode(mode, value);
	if (css) v.setVariableCodeSyntax('WEB', 'var(' + css + ')');
	return v;
}
async function foundations() {
	const [pc, pm] = await collection('Color Primitives');
	const [cc, cm] = await collection('Color');
	const [sc, sm] = await collection('Spacing & Size');
	const [rc, rm] = await collection('Radius & Border');
	const [tc, tm] = await collection('Typography');
	const [mc, mm] = await collection('Motion');
	const rawDefs = [
		['neutral/0', '#ffffff', '--sivir-neutral-0'],
		['neutral/10', '#fdfdfc', '--sivir-neutral-10'],
		['neutral/50', '#f8f8f5', '--sivir-neutral-50'],
		['neutral/100', '#f0f0ed', '--sivir-neutral-100'],
		['neutral/150', '#e8e8e3', '--sivir-neutral-150'],
		['neutral/300', '#d4d4ce', '--sivir-neutral-300'],
		['neutral/500', '#6e6e68', '--sivir-neutral-500'],
		['neutral/900', '#1d1d1a', '--sivir-neutral-900'],
		['blue/50', '#eef4ff', '--sivir-blue-50'],
		['blue/500', '#4a9eff', '--sivir-blue-500'],
		['status/success', H.success, '--sivir-success'],
		['status/warning', H.warning, '--sivir-warning'],
		['status/error', H.error, '--sivir-error'],
		['brand/primary', H.primary, '--color-primary'],
		['brand/primary-hover', H.hover, '--color-primary-hover']
	];
	const raw = new Map();
	for (const [n, h, css] of rawDefs)
		raw.set(n, await variable(pc, pm, n, 'COLOR', color(h), css, []));
	raw.set(
		'brand/ring-30',
		await variable(pc, pm, 'brand/ring-30', 'COLOR', color(H.primary, 0.3), '--color-ring', [])
	);
	raw.set(
		'black/overlay-18',
		await variable(
			pc,
			pm,
			'black/overlay-18',
			'COLOR',
			color('#000000', 0.18),
			'--color-overlay',
			[]
		)
	);
	const sourceDefs = [
		['sivir/neutral/0', 'neutral/0', '--sivir-neutral-0'],
		['sivir/neutral/10', 'neutral/10', '--sivir-neutral-10'],
		['sivir/neutral/50', 'neutral/50', '--sivir-neutral-50'],
		['sivir/neutral/100', 'neutral/100', '--sivir-neutral-100'],
		['sivir/neutral/150', 'neutral/150', '--sivir-neutral-150'],
		['sivir/neutral/300', 'neutral/300', '--sivir-neutral-300'],
		['sivir/neutral/500', 'neutral/500', '--sivir-neutral-500'],
		['sivir/neutral/900', 'neutral/900', '--sivir-neutral-900'],
		['sivir/blue/50', 'blue/50', '--sivir-blue-50'],
		['sivir/blue/500', 'blue/500', '--sivir-blue-500'],
		['sivir/success', 'status/success', '--sivir-success'],
		['sivir/warning', 'status/warning', '--sivir-warning'],
		['sivir/error', 'status/error', '--sivir-error']
	];
	for (const [n, s, css] of sourceDefs)
		vars.set(
			n,
			await variable(cc, cm, n, 'COLOR', figma.variables.createVariableAlias(raw.get(s)), css, [])
		);
	const fill = ['FRAME_FILL', 'SHAPE_FILL'],
		ink = ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR'],
		broad = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'];
	const sem = [
		['color/background', 'sivir/neutral/10', '--color-background', fill],
		['color/card', 'sivir/neutral/0', '--color-card', fill],
		['color/panel', 'sivir/neutral/0', '--color-panel', fill],
		['color/muted', 'sivir/neutral/50', '--color-muted', fill],
		['color/secondary', 'sivir/neutral/100', '--color-secondary', fill],
		['color/border', 'sivir/neutral/150', '--color-border', ['STROKE_COLOR']],
		['color/border-strong', 'sivir/neutral/300', '--color-border-strong', ['STROKE_COLOR']],
		['color/input', 'sivir/neutral/300', '--color-input', ['STROKE_COLOR']],
		['color/foreground', 'sivir/neutral/900', '--color-foreground', ink],
		['color/foreground-muted', 'sivir/neutral/500', '--color-foreground-muted', ink],
		['color/on-primary', 'sivir/neutral/0', '--color-on-primary', ['TEXT_FILL', 'SHAPE_FILL']],
		['color/accent-tint', 'sivir/blue/50', '--color-accent-tint', fill],
		['color/success', 'sivir/success', '--color-success', broad],
		['color/warning', 'sivir/warning', '--color-warning', broad],
		['color/error', 'sivir/error', '--color-error', broad],
		['color/info', 'sivir/blue/500', '--color-info', broad],
		['color/tooltip', 'sivir/neutral/900', '--color-tooltip', fill],
		[
			'color/tooltip-foreground',
			'sivir/neutral/0',
			'--color-tooltip-foreground',
			['TEXT_FILL', 'SHAPE_FILL']
		]
	];
	for (const [n, s, css, scope] of sem)
		vars.set(
			n,
			await variable(
				cc,
				cm,
				n,
				'COLOR',
				figma.variables.createVariableAlias(vars.get(s)),
				css,
				scope
			)
		);
	for (const [n, s, css, scope] of [
		['color/primary', 'brand/primary', '--color-primary', broad],
		['color/primary-hover', 'brand/primary-hover', '--color-primary-hover', broad],
		['color/ring', 'brand/ring-30', '--color-ring', ['STROKE_COLOR', 'EFFECT_COLOR']],
		['color/overlay', 'black/overlay-18', '--color-overlay', fill]
	])
		vars.set(
			n,
			await variable(
				cc,
				cm,
				n,
				'COLOR',
				figma.variables.createVariableAlias(raw.get(s)),
				css,
				scope
			)
		);
	for (const [n, s, css, scope] of [
		['color/field', 'color/card', '--color-field', fill],
		['color/field-hover', 'color/muted', '--color-field-hover', fill],
		['color/field-foreground', 'color/foreground', '--color-field-foreground', ink]
	])
		vars.set(
			n,
			await variable(
				cc,
				cm,
				n,
				'COLOR',
				figma.variables.createVariableAlias(vars.get(s)),
				css,
				scope
			)
		);
	const spacing = [
		['sivir/space-unit', 3.6, '--sivir-space-unit', 'GAP'],
		['sivir/space/1', 3.6, '--sivir-space-1', 'GAP'],
		['sivir/space/2', 7.2, '--sivir-space-2', 'GAP'],
		['sivir/space/3', 10.8, '--sivir-space-3', 'GAP'],
		['sivir/space/4', 14.4, '--sivir-space-4', 'GAP'],
		['sivir/space/5', 18, '--sivir-space-5', 'GAP'],
		['sivir/space/6', 21.6, '--sivir-space-6', 'GAP'],
		['sivir/space/8', 28.8, '--sivir-space-8', 'GAP'],
		['sivir/space/10', 36, '--sivir-space-10', 'GAP'],
		['size/control-sm', 28.8, '--size-control-sm', 'WIDTH_HEIGHT'],
		['size/control-md', 36, '--size-control-md', 'WIDTH_HEIGHT'],
		['size/control-lg', 36, '--size-control-lg', 'WIDTH_HEIGHT'],
		['size/icon-md', 28.8, '--size-icon-md', 'WIDTH_HEIGHT']
	];
	for (const d of spacing) await variable(sc, sm, d[0], 'FLOAT', d[1], d[2], [d[3]]);
	for (const d of [
		['radius/sm', 6, '--radius-sm', 'CORNER_RADIUS'],
		['radius/md', 8, '--radius-md', 'CORNER_RADIUS'],
		['radius/lg', 10, '--radius-lg', 'CORNER_RADIUS'],
		['radius/xl', 14, '--radius-xl', 'CORNER_RADIUS'],
		['border/size', 1, '--border-size', 'STROKE_FLOAT']
	])
		await variable(rc, rm, d[0], 'FLOAT', d[1], d[2], [d[3]]);
	const types = [
		['font/sans', 'STRING', 'DM Sans', '--font-sans', 'FONT_FAMILY'],
		['font/mono', 'STRING', 'JetBrains Mono', '--font-mono', 'FONT_FAMILY'],
		['font/header', 'STRING', 'DM Sans', '--font-header', 'FONT_FAMILY'],
		['text/xs', 'FLOAT', 12, '--text-xs', 'FONT_SIZE'],
		['text/sm', 'FLOAT', 14, '--text-sm', 'FONT_SIZE'],
		['text/base', 'FLOAT', 14, '--text-base', 'FONT_SIZE'],
		['font-size/header', 'FLOAT', 16, '--font-size-header', 'FONT_SIZE'],
		['font-size/body', 'FLOAT', 14, '--font-size-body', 'FONT_SIZE'],
		['font-size/label', 'FLOAT', 13, '--font-size-label', 'FONT_SIZE'],
		['font-size/button', 'FLOAT', 14, '--font-size-button', 'FONT_SIZE'],
		['font-size/badge', 'FLOAT', 12, '--font-size-badge', 'FONT_SIZE'],
		['font-weight/header', 'FLOAT', 600, '--font-weight-header', 'FONT_WEIGHT'],
		['font-weight/body', 'FLOAT', 400, '--font-weight-body', 'FONT_WEIGHT'],
		['font-weight/label', 'FLOAT', 500, '--font-weight-label', 'FONT_WEIGHT'],
		['font-weight/button', 'FLOAT', 500, '--font-weight-button', 'FONT_WEIGHT'],
		['font-weight/badge', 'FLOAT', 500, '--font-weight-badge', 'FONT_WEIGHT'],
		['font-weight/description', 'FLOAT', 400, '--font-weight-description', 'FONT_WEIGHT'],
		['tracking/header', 'FLOAT', -1.5, '--tracking-header', 'LETTER_SPACING'],
		['tracking/body', 'FLOAT', 0, '--tracking-body', 'LETTER_SPACING'],
		['tracking/label', 'FLOAT', 0, '--tracking-label', 'LETTER_SPACING'],
		['tracking/button', 'FLOAT', 0, '--tracking-button', 'LETTER_SPACING'],
		['tracking/badge', 'FLOAT', 0, '--tracking-badge', 'LETTER_SPACING']
	];
	for (const d of types) await variable(tc, tm, d[0], d[1], d[2], d[3], [d[4]]);
	const motion = [
		['duration/hover', 'FLOAT', 120, '--motion-duration-hover'],
		['duration/menu', 'FLOAT', 40, '--motion-duration-menu'],
		['duration/panel', 'FLOAT', 180, '--motion-duration-panel'],
		['duration/sheet', 'FLOAT', 320, '--motion-duration-sheet'],
		['duration/sheet-out', 'FLOAT', 220, '--motion-duration-sheet-out'],
		['duration/overlay', 'FLOAT', 120, '--motion-duration-overlay'],
		['duration/toast-in', 'FLOAT', 320, '--motion-duration-toast-in'],
		['duration/toast-out', 'FLOAT', 240, '--motion-duration-toast-out'],
		['panel/y', 'FLOAT', 2, '--motion-panel-y'],
		['panel/scale-start', 'FLOAT', 0.97, '--motion-panel-scale-start'],
		['duration/panel-in', 'FLOAT', 110, '--motion-duration-panel-in'],
		['duration/panel-out', 'FLOAT', 150, '--motion-duration-panel-out'],
		['duration/modal-in', 'FLOAT', 180, '--motion-duration-modal-in'],
		['duration/modal-out', 'FLOAT', 110, '--motion-duration-modal-out'],
		['press/px', 'FLOAT', 2, '--motion-press-px'],
		['duration/press', 'FLOAT', 160, '--motion-duration-press'],
		['ease/out', 'STRING', 'cubic-bezier(0.23, 1, 0.32, 1)', '--ease-out'],
		['ease/press', 'STRING', 'cubic-bezier(0.22, 1, 0.36, 1)', '--ease-press'],
		['ease/in-out', 'STRING', 'cubic-bezier(0.77, 0, 0.175, 1)', '--ease-in-out']
	];
	for (const d of motion) await variable(mc, mm, d[0], d[1], d[2], d[3], []);
}

async function styles() {
	const existing = await figma.getLocalTextStylesAsync();
	for (const d of [
		['Sivir/Header', 'DM Sans', 'SemiBold', 16, -1.5],
		['Sivir/Body', 'DM Sans', 'Regular', 14, 0],
		['Sivir/Label', 'DM Sans', 'Medium', 13, 0],
		['Sivir/Button', 'DM Sans', 'Medium', 14, 0],
		['Sivir/Badge', 'DM Sans', 'Medium', 12, 0],
		['Sivir/Code', 'JetBrains Mono', 'Regular', 14, 0]
	]) {
		let s = existing.find((x) => x.name === d[0]);
		if (!s) s = figma.createTextStyle();
		s.name = d[0];
		s.fontName = { family: d[1], style: d[2] };
		s.fontSize = d[3];
		s.lineHeight = { unit: 'AUTO' };
		s.letterSpacing = { unit: 'PERCENT', value: d[4] };
	}
	const effects = await figma.getLocalEffectStylesAsync();
	const defs = [
		[
			'Sivir/Elevation 1',
			[
				{
					type: 'DROP_SHADOW',
					color: color('#000000', 0.04),
					offset: { x: 0, y: 4 },
					radius: 2,
					spread: 0,
					visible: true,
					blendMode: 'NORMAL'
				}
			]
		],
		[
			'Sivir/Elevation Float',
			[
				{
					type: 'DROP_SHADOW',
					color: color('#000000', 0.12),
					offset: { x: 0, y: 8 },
					radius: 24,
					spread: -8,
					visible: true,
					blendMode: 'NORMAL'
				},
				{
					type: 'DROP_SHADOW',
					color: color('#000000', 0.06),
					offset: { x: 0, y: 2 },
					radius: 6,
					spread: 0,
					visible: true,
					blendMode: 'NORMAL'
				}
			]
		],
		[
			'Sivir/Focus Ring',
			[
				{
					type: 'DROP_SHADOW',
					color: color(H.primary, 0.3),
					offset: { x: 0, y: 0 },
					radius: 0,
					spread: 3,
					visible: true,
					blendMode: 'NORMAL'
				}
			]
		]
	];
	for (const [name, value] of defs) {
		let s = effects.find((x) => x.name === name);
		if (!s) s = figma.createEffectStyle();
		s.name = name;
		s.effects = value;
	}
}

function bound(hex, name, alpha) {
	const p = paint(hex, alpha),
		v = vars.get(name);
	return v ? figma.variables.setBoundVariableForPaint(p, 'color', v) : p;
}
function fill(node, name, hex, alpha) {
	node.fills = [bound(hex, name, alpha)];
}
function stroke(node, name, hex) {
	node.strokes = [bound(hex, name)];
	node.strokeWeight = 1;
}
function txt(value, size, weight, name, hex, mono) {
	const n = figma.createText();
	n.fontName = { family: mono ? 'JetBrains Mono' : 'DM Sans', style: weight || 'Regular' };
	n.fontSize = size || 14;
	n.characters = value;
	n.textAutoResize = 'WIDTH_AND_HEIGHT';
	fill(n, name || 'color/foreground', hex || H.fg);
	return n;
}
function place(parent, node, x, y) {
	parent.appendChild(node);
	node.x = x;
	node.y = y;
	return node;
}
function panel(name, w, h, r) {
	const n = figma.createFrame();
	n.name = name;
	n.resize(w, h);
	n.cornerRadius = r === undefined ? 10 : r;
	fill(n, 'color/card', H.card);
	stroke(n, 'color/border', H.border);
	return n;
}
function circle(hex, size) {
	const n = figma.createEllipse();
	n.resize(size, size);
	n.fills = [paint(hex)];
	return n;
}
function line(w) {
	const n = figma.createRectangle();
	n.resize(w, 1);
	fill(n, 'color/border', H.border);
	return n;
}
function badge(label, tone) {
	const tones = {
		success: [H.success, 'color/success'],
		warning: [H.warning, 'color/warning'],
		error: [H.error, 'color/error'],
		info: [H.info, 'color/info'],
		neutral: [H.sub, 'color/foreground-muted']
	};
	const t = tones[tone] || tones.neutral,
		n = panel('Badge', 96, 26, 99);
	n.strokes = [];
	n.fills = [paint(t[0], 0.11)];
	place(n, circle(t[0], 6), 8, 10);
	place(n, txt(label, 12, 'Medium', t[1], t[0]), 21, 5);
	return n;
}
function button(label, kind) {
	const n = panel('Button', kind === 'wide' ? 128 : 102, 36, 8);
	if (kind === 'primary') {
		fill(n, 'color/primary', H.primary);
		n.strokes = [];
	}
	if (kind === 'danger') {
		fill(n, 'color/error', H.error);
		n.strokes = [];
	}
	place(
		n,
		txt(
			label,
			14,
			'Medium',
			kind === 'primary' || kind === 'danger' ? 'color/on-primary' : 'color/foreground',
			kind === 'primary' || kind === 'danger' ? '#ffffff' : H.fg
		),
		12,
		9
	);
	return n;
}
function input(label, w, h) {
	const n = panel('Input', w || 250, h || 38, 8);
	fill(n, 'color/field', H.card);
	stroke(n, 'color/input', H.strong);
	place(n, txt(label, 14, 'Regular', 'color/foreground-muted', H.sub), 11, 10);
	return n;
}

const componentSpec = {
	Accordion: ['list', 'What can this agent access?', 'Workspace files and approved tools'],
	Alert: ['notice', 'Agent connected', 'The runtime is ready for tasks.'],
	'Alert Dialog': ['dialog', 'Stop this run?', 'The active tool call will finish first.'],
	'Approval Request': ['approval', 'Approval required', 'Deploy Agent wants to run a command.'],
	Attachment: ['file', 'run-log.json', '42 KB · JSON'],
	Avatar: ['avatar', 'SA', 'Research Agent'],
	Badge: ['badge', 'Running', 'success'],
	Breadcrumb: ['crumb', 'Runs / run_9F2A', ''],
	Button: ['button', 'Start run', 'primary'],
	Card: ['card', 'Research agent', 'Web research and synthesis'],
	Checkbox: ['check', 'Include tool output', 'Checked'],
	'Code Block': ['code', 'const result = await agent.run(task)', 'return result.output'],
	Collapsible: ['list', '3 completed tool calls', 'Show details'],
	'Color Picker': ['colors', 'Agent color', '#1F9BE6'],
	Combobox: ['field', 'Assign agent', 'Search agents…'],
	Command: ['menu', 'Type a command…', 'Start a new run · Open fleet'],
	'Context Menu': ['menu', 'Open run', 'Duplicate · Archive'],
	Conversation: ['content', 'Agent conversation', 'User and agent messages'],
	'Copy Button': ['button', 'Copy', ''],
	'Dropdown Menu': ['menu', 'Rename agent', 'Duplicate · Move · Archive'],
	'Fullscreen Nav': ['nav', 'Sivir Orbit', 'Overview · Fleet · Runs · Settings'],
	'Hover Card': ['card', 'Research Agent', 'Healthy · active now'],
	Input: ['field', 'Agent name', 'Type a name…'],
	Label: ['label', 'Workspace name', ''],
	Markdown: ['content', 'Run summary', 'The agent completed 4 tool calls.'],
	Message: ['message', 'Agent', 'I found the failing deployment step.'],
	Modal: ['dialog', 'Create agent', 'Configure a reusable workspace agent.'],
	Pagination: ['pages', '‹  1  2  3  ›', ''],
	Popover: ['card', 'Run filters', 'Status · Agent · Date'],
	Progress: ['progress', '62% complete', ''],
	'Prompt Composer': ['composer', 'Ask an agent to investigate…', 'Research Agent'],
	'Radio Group': ['radio', 'Balanced · recommended', 'Fast · Thorough'],
	Reasoning: ['notice', 'Reasoning', 'Analyzing 14 traces…'],
	'Response Stream': ['notice', 'Streaming response', 'The most likely root cause is…'],
	'Scroll Area': ['list', 'Run events', 'Completed · Running · Queued'],
	Select: ['field', 'Model', 'GPT-5.6  ▾'],
	Sheet: ['dialog', 'Run settings', 'Max steps · timeout · approvals'],
	Shortcut: ['keys', '⌘  K', ''],
	Skeleton: ['skeleton', '', ''],
	Slider: ['slider', 'Temperature · 0.7', ''],
	Spinner: ['spinner', '', ''],
	Switch: ['switch', 'Auto-approve safe tools', 'On'],
	Tabs: ['tabs', 'Overview  Trace  Output', ''],
	Textarea: ['textarea', 'Describe the objective…', ''],
	Toast: ['notice', 'Run completed', 'All 12 steps finished successfully.'],
	Toggle: ['button', 'Trace', ''],
	'Toggle Group': ['tabs', 'Day  Week  Month', ''],
	Tool: ['tool', 'browser.search', 'Completed · 1.2s'],
	Toolbar: ['tabs', 'Undo  Redo  Copy  Share', ''],
	Tooltip: ['tooltip', 'Open run details', '']
};

function component(name) {
	const s = componentSpec[name] || ['card', name, 'Sivir UI component'],
		kind = s[0];
	const c = figma.createComponent();
	c.name = name;
	c.description = 'Sivir UI ' + name + ' component · light-first · semantic-token bound';
	c.resize(kind === 'composer' ? 400 : 280, kind === 'dialog' ? 190 : 110);
	c.cornerRadius = 10;
	fill(c, 'color/card', H.card);
	stroke(c, 'color/border', H.border);
	if (['button', 'badge', 'crumb', 'label', 'keys', 'spinner', 'tooltip'].includes(kind)) {
		c.fills = [];
		c.strokes = [];
	}
	if (kind === 'avatar') {
		c.resize(64, 64);
		c.cornerRadius = 99;
		fill(c, 'color/accent-tint', H.tint);
		place(c, txt(s[1], 18, 'SemiBold', 'color/primary', H.primary), 18, 20);
	} else if (kind === 'button') place(c, button(s[1], s[2]), 0, 0);
	else if (kind === 'badge') place(c, badge(s[1], s[2]), 0, 0);
	else if (kind === 'field') place(c, input(s[2] || s[1], 260), 10, 46);
	else if (kind === 'check') {
		const b = panel('Checked', 18, 18, 5);
		fill(b, 'color/primary', H.primary);
		b.strokes = [];
		place(b, txt('✓', 12, 'SemiBold', 'color/on-primary', '#fff'), 4, 2);
		place(c, b, 12, 18);
		place(c, txt(s[1], 14, 'Medium'), 42, 18);
	} else if (kind === 'progress') {
		place(c, txt(s[1], 13, 'SemiBold'), 12, 12);
		const track = panel('Track', 250, 8, 99);
		track.strokes = [];
		fill(track, 'color/secondary', H.secondary);
		const bar = figma.createRectangle();
		bar.resize(155, 8);
		bar.cornerRadius = 99;
		fill(bar, 'color/primary', H.primary);
		place(track, bar, 0, 0);
		place(c, track, 12, 46);
	} else if (kind === 'switch') {
		const track = panel('On', 38, 22, 99);
		fill(track, 'color/primary', H.primary);
		track.strokes = [];
		place(track, circle('#ffffff', 16), 19, 3);
		place(c, track, 12, 16);
		place(c, txt(s[1], 14, 'Medium'), 62, 18);
	} else if (kind === 'spinner') {
		const e = figma.createEllipse();
		e.resize(28, 28);
		e.fills = [];
		e.strokes = [paint(H.primary)];
		e.strokeWeight = 3;
		place(c, e, 10, 10);
		c.resize(48, 48);
	} else if (kind === 'skeleton') {
		[150, 235, 190].forEach((w, i) => {
			const r = figma.createRectangle();
			r.resize(w, 12);
			r.cornerRadius = 6;
			fill(r, 'color/secondary', H.secondary);
			place(c, r, 12, 16 + i * 26);
		});
	} else if (kind === 'colors') {
		place(c, txt(s[1], 14, 'SemiBold'), 12, 12);
		[H.primary, H.success, H.warning, H.error, '#8b5cf6'].forEach((h, i) =>
			place(c, circle(h, 24), 12 + i * 34, 44)
		);
		place(c, txt(s[2], 12, 'Regular', 'color/foreground-muted', H.sub, true), 12, 78);
	} else if (kind === 'composer') {
		place(c, txt(s[1], 14, 'Regular', 'color/foreground-muted', H.sub), 14, 14);
		place(c, line(372), 14, 58);
		place(c, badge(s[2], 'info'), 14, 76);
		place(c, button('Send', 'primary'), 286, 72);
		c.resize(400, 122);
	} else if (kind === 'dialog' || kind === 'approval') {
		place(c, txt(s[1], 16, 'SemiBold'), 14, 14);
		const body = txt(s[2], 13, 'Regular', 'color/foreground-muted', H.sub);
		body.textAutoResize = 'HEIGHT';
		body.resize(250, 38);
		place(c, body, 14, 46);
		if (kind === 'approval') place(c, input('npm run deploy', 250), 14, 94);
		place(
			c,
			button(kind === 'approval' ? 'Approve' : 'Confirm', 'primary'),
			164,
			kind === 'approval' ? 144 : 110
		);
		c.resize(280, kind === 'approval' ? 194 : 160);
	} else if (kind === 'code' || kind === 'tool') {
		fill(c, 'color/foreground', H.fg);
		c.strokes = [];
		place(c, txt(s[1], 12, 'Regular', 'color/tooltip-foreground', '#fff', true), 12, 15);
		place(c, txt(s[2], 12, 'Regular', 'color/tooltip-foreground', '#fff', true), 12, 44);
	} else if (kind === 'tooltip') {
		const p = panel('Tooltip', 130, 30, 8);
		fill(p, 'color/tooltip', H.tooltip);
		p.strokes = [];
		place(p, txt(s[1], 13, 'Medium', 'color/tooltip-foreground', '#fff'), 9, 7);
		place(c, p, 0, 0);
		c.resize(130, 30);
	} else {
		place(c, txt(s[1], 14, 'SemiBold'), 12, 12);
		const body = txt(s[2], 13, 'Regular', 'color/foreground-muted', H.sub);
		body.textAutoResize = 'HEIGHT';
		body.resize(250, 42);
		place(c, body, 12, 42);
		if (['notice', 'card', 'message'].includes(kind))
			place(
				c,
				badge(kind === 'notice' ? 'Active' : 'Healthy', kind === 'notice' ? 'info' : 'success'),
				12,
				78
			);
		if (kind === 'textarea') {
			place(c, input(s[1], 256, 78), 12, 16);
		}
	}
	return tagged(c);
}

async function page(name) {
	let p = figma.root.children.find((x) => x.type === 'PAGE' && x.name === name);
	if (!p) {
		const blank = figma.root.children.find(
			(x) => x.type === 'PAGE' && x.name === 'Page 1' && x.children.length === 0
		);
		p = blank || figma.createPage();
		p.name = name;
	}
	return p;
}
function clear(page) {
	for (const n of [...page.children]) if (n.getPluginData(TAG) === '1') n.remove();
}

async function foundationPage() {
	const p = await page('Foundations');
	await figma.setCurrentPageAsync(p);
	clear(p);
	const hero = tagged(panel('Sivir UI Foundations', 1240, 160, 18));
	hero.x = 80;
	hero.y = 80;
	fill(hero, 'color/foreground', H.fg);
	hero.strokes = [];
	place(hero, txt('Sivir UI', 34, 'SemiBold', 'color/tooltip-foreground', '#fff'), 30, 28);
	place(
		hero,
		txt(
			'Light-first · source-aligned · mockup ready',
			16,
			'Regular',
			'color/tooltip-foreground',
			'#fff'
		),
		30,
		78
	);
	place(
		hero,
		txt(
			'DM Sans  ·  JetBrains Mono  ·  3.6px density unit',
			13,
			'Regular',
			'color/tooltip-foreground',
			'#fff'
		),
		30,
		116
	);
	p.appendChild(hero);
	const board = tagged(panel('Semantic color tokens', 1240, 420, 18));
	board.x = 80;
	board.y = 280;
	place(board, txt('Semantic color tokens', 22, 'SemiBold'), 26, 22);
	const sw = [
		['Background', 'color/background', H.bg],
		['Card', 'color/card', H.card],
		['Muted', 'color/muted', H.muted],
		['Secondary', 'color/secondary', H.secondary],
		['Border', 'color/border', H.border],
		['Foreground', 'color/foreground', H.fg],
		['Primary', 'color/primary', H.primary],
		['Accent', 'color/accent-tint', H.tint],
		['Success', 'color/success', H.success],
		['Warning', 'color/warning', H.warning],
		['Error', 'color/error', H.error],
		['Info', 'color/info', H.info]
	];
	sw.forEach((d, i) => {
		const x = 26 + (i % 6) * 198,
			y = 72 + Math.floor(i / 6) * 150,
			r = figma.createRectangle();
		r.resize(174, 88);
		r.cornerRadius = 9;
		r.fills = [bound(d[2], d[1])];
		place(board, r, x, y);
		place(board, txt(d[0], 13, 'SemiBold'), x, y + 98);
		place(board, txt(d[1], 10, 'Regular', 'color/foreground-muted', H.sub, true), x, y + 118);
	});
	p.appendChild(board);
	const type = tagged(panel('Typography and geometry', 1240, 300, 18));
	type.x = 80;
	type.y = 740;
	place(type, txt('Typography', 22, 'SemiBold'), 26, 22);
	place(type, txt('Header · DM Sans SemiBold 16', 16, 'SemiBold'), 26, 76);
	place(type, txt('Body · DM Sans Regular 14 — calm, compact, readable.', 14, 'Regular'), 26, 116);
	place(type, txt('Label · DM Sans Medium 13', 13, 'Medium'), 26, 156);
	place(
		type,
		txt('const run = await agent.execute(task)', 14, 'Regular', 'color/foreground', H.fg, true),
		26,
		204
	);
	place(type, txt('Radii · 6 / 8 / 10 / 14', 22, 'SemiBold'), 650, 22);
	[6, 8, 10, 14].forEach((r, i) => {
		const n = panel('Radius ' + r, 112, 86, r);
		fill(n, 'color/muted', H.muted);
		place(n, txt(r + 'px', 12, 'Medium'), 14, 56);
		place(type, n, 650 + i * 132, 76);
	});
	p.appendChild(type);
	return p;
}

async function componentPage() {
	const p = await page('Components');
	await figma.setCurrentPageAsync(p);
	clear(p);
	const h = tagged(txt('Sivir UI Components', 34, 'SemiBold'));
	h.x = 80;
	h.y = 60;
	p.appendChild(h);
	const sub = tagged(
		txt(
			'50 public Svelte components · light-first · semantic-token bound',
			16,
			'Regular',
			'color/foreground-muted',
			H.sub
		)
	);
	sub.x = 80;
	sub.y = 108;
	p.appendChild(sub);
	const map = new Map();
	NAMES.forEach((name, i) => {
		const s = tagged(panel(name + ' specimen', 330, 260, 14));
		s.strokes = [];
		fill(s, 'color/background', H.bg);
		place(s, txt(String(i + 1).padStart(2, '0') + '  ' + name, 15, 'SemiBold'), 12, 10);
		const c = component(name);
		map.set(name, c);
		place(s, c, 12, 48);
		s.x = 80 + (i % 4) * 360;
		s.y = 160 + Math.floor(i / 4) * 300;
		p.appendChild(s);
	});
	return { p, map };
}

function nav(screen, active) {
	const n = panel('Sidebar', 220, 1024, 0);
	n.cornerRadius = 0;
	place(n, circle(H.primary, 24), 22, 22);
	place(n, txt('Sivir Orbit', 17, 'SemiBold'), 56, 24);
	['Overview', 'Agent Fleet', 'Runs', 'Evaluations'].forEach((v, i) => {
		const r = panel(v, 188, 40, 8);
		r.strokes = [];
		r.fills = v === active ? [bound(H.tint, 'color/accent-tint')] : [];
		place(r, circle(v === active ? H.primary : H.sub, 8), 12, 16);
		place(
			r,
			txt(
				v,
				14,
				v === active ? 'SemiBold' : 'Medium',
				v === active ? 'color/primary' : 'color/foreground',
				v === active ? H.primary : H.fg
			),
			34,
			11
		);
		place(n, r, 16, 90 + i * 48);
	});
	place(n, txt('WORKSPACE', 11, 'SemiBold', 'color/foreground-muted', H.sub), 22, 330);
	const w = panel('Workspace', 176, 74, 10);
	place(w, txt('Acme Labs', 14, 'SemiBold'), 12, 12);
	place(w, txt('Production', 12, 'Regular', 'color/foreground-muted', H.sub), 12, 38);
	place(w, badge('Live', 'success'), 88, 24);
	place(n, w, 22, 352);
	place(screen, n, 0, 0);
}
function top(screen, eyebrow, title, detail) {
	const n = panel('Top bar', 1220, 72, 0);
	n.cornerRadius = 0;
	place(n, txt(eyebrow, 11, 'Medium', 'color/foreground-muted', H.sub), 32, 13);
	place(n, txt(title, 17, 'SemiBold'), 32, 34);
	if (detail) place(n, txt(detail, 13, 'Regular', 'color/foreground-muted', H.sub), 950, 28);
	place(screen, n, 220, 0);
}
function heading(parent, title, sub, x, y) {
	place(parent, txt(title, 25, 'SemiBold'), x, y);
	place(parent, txt(sub, 14, 'Regular', 'color/foreground-muted', H.sub), x, y + 38);
}
function metric(label, value, note, tone) {
	const c = panel(label, 246, 108, 12);
	place(c, txt(label, 12, 'Medium', 'color/foreground-muted', H.sub), 15, 14);
	place(c, txt(value, 27, 'SemiBold'), 15, 40);
	place(c, badge(note, tone), 142, 68);
	return c;
}

function fleetScreen(map) {
	const s = tagged(figma.createFrame());
	s.name = '01 · Agent Fleet';
	s.resize(1440, 1024);
	fill(s, 'color/background', H.bg);
	s.clipsContent = true;
	nav(s, 'Agent Fleet');
	top(s, 'OPERATIONS', 'Agent Fleet', 'Updated just now');
	heading(s, 'Agent Fleet', 'Monitor health, throughput, and current work.', 252, 100);
	const b = map.get('Button').createInstance();
	place(s, b, 1280, 108);
	[
		['Active agents', '18', '+2 today', 'success'],
		['Runs in progress', '7', '3 queued', 'info'],
		['Success rate', '96.4%', '+1.8%', 'success'],
		['Median latency', '8.2s', '-0.6s', 'success']
	].forEach((d, i) => place(s, metric(...d), 252 + i * 262, 178));
	const table = panel('Fleet table', 826, 620, 14);
	place(s, table, 252, 310);
	place(table, txt('Agents', 16, 'SemiBold'), 18, 16);
	['NAME', 'STATUS', 'RUNS / 24H', 'P50 LATENCY'].forEach((v, i) =>
		place(
			table,
			txt(v, 10, 'SemiBold', 'color/foreground-muted', H.sub),
			[18, 338, 498, 660][i],
			58
		)
	);
	const rows = [
		['Research Agent', 'Web research & synthesis', 'Online', '142', '7.4s'],
		['Support Triage', 'Ticket classification', 'Online', '389', '3.1s'],
		['Deploy Agent', 'Release coordination', 'Degraded', '28', '18.9s'],
		['Data Analyst', 'SQL & reporting', 'Online', '91', '11.2s'],
		['QA Navigator', 'Browser testing', 'Online', '67', '9.8s'],
		['Incident Scribe', 'Timeline & comms', 'Idle', '16', '—']
	];
	rows.forEach((d, i) => {
		const y = 88 + i * 82;
		place(
			table,
			circle(d[2] === 'Online' ? H.success : d[2] === 'Degraded' ? H.warning : H.sub, 32),
			18,
			y
		);
		place(table, txt(d[0], 14, 'SemiBold'), 62, y - 2);
		place(table, txt(d[1], 12, 'Regular', 'color/foreground-muted', H.sub), 62, y + 22);
		place(
			table,
			badge(d[2], d[2] === 'Online' ? 'success' : d[2] === 'Degraded' ? 'warning' : 'neutral'),
			330,
			y
		);
		place(table, txt(d[3], 14, 'Medium'), 500, y + 7);
		place(table, txt(d[4], 13, 'Regular', 'color/foreground-muted', H.sub), 660, y + 7);
		place(table, line(790), 18, y + 56);
	});
	const a = panel('Live activity', 322, 620, 14);
	place(s, a, 1096, 310);
	place(a, txt('Live activity', 16, 'SemiBold'), 18, 16);
	[
		['Research Agent', 'Completed browser.search', '12s', H.success],
		['Deploy Agent', 'Approval requested', '48s', H.warning],
		['QA Navigator', 'Opened checkout flow', '1m', H.primary],
		['Support Triage', 'Classified 8 tickets', '2m', H.success],
		['Data Analyst', 'Running warehouse query', '4m', H.primary]
	].forEach((d, i) => {
		const y = 68 + i * 96;
		place(a, circle(d[3], 9), 18, y + 5);
		place(a, txt(d[0], 13, 'SemiBold'), 40, y);
		place(a, txt(d[1], 12, 'Regular', 'color/foreground-muted', H.sub), 40, y + 24);
		place(a, txt(d[2] + ' ago', 11, 'Regular', 'color/foreground-muted', H.sub), 40, y + 48);
	});
	return s;
}

function liveScreen(map) {
	const s = tagged(figma.createFrame());
	s.name = '02 · Live Run';
	s.resize(1440, 1024);
	fill(s, 'color/background', H.bg);
	s.clipsContent = true;
	nav(s, 'Runs');
	top(s, 'RUN · RUN_9F2A', 'Investigate checkout failures', 'Started 6m ago');
	heading(s, 'Live Run', 'Research Agent is investigating elevated checkout errors.', 252, 96);
	place(s, badge('Running', 'success'), 252, 162);
	place(s, button('Stop run', 'danger'), 1300, 112);
	const plan = panel('Execution plan', 270, 790, 14);
	place(s, plan, 252, 206);
	place(plan, txt('Execution plan', 15, 'SemiBold'), 16, 16);
	const steps = [
		['Collect recent traces', 'Complete'],
		['Group failing requests', 'Complete'],
		['Inspect deployment diff', 'Complete'],
		['Query cache metrics', 'Running'],
		['Validate hypothesis', 'Queued'],
		['Write incident summary', 'Queued']
	];
	steps.forEach((d, i) => {
		const y = 58 + i * 104,
			c = d[1] === 'Complete' ? H.success : d[1] === 'Running' ? H.primary : H.sub;
		place(plan, circle(c, 24), 14, y);
		place(plan, txt(String(i + 1), 11, 'SemiBold', 'color/on-primary', '#fff'), 22, y + 5);
		place(plan, txt(d[0], 13, 'SemiBold'), 48, y);
		place(
			plan,
			txt(
				d[1],
				12,
				'Regular',
				d[1] === 'Complete'
					? 'color/success'
					: d[1] === 'Running'
						? 'color/primary'
						: 'color/foreground-muted',
				c
			),
			48,
			y + 26
		);
	});
	const stream = panel('Run stream', 552, 790, 14);
	place(s, stream, 540, 206);
	place(stream, txt('Run stream', 15, 'SemiBold'), 16, 16);
	const msgs = [
		['USER', 'Investigate checkout failures after today’s deploy.', H.sub],
		['AGENT', 'I’ll inspect traces, changes, and cache health.', H.primary],
		['TOOL', 'trace.search · 182 requests · 1.8s', H.success],
		['AGENT', 'Failures cluster on stale cart snapshots.', H.primary],
		['TOOL', 'metrics.query · cache_miss_rate +42%', H.success],
		['AGENT', 'Delayed invalidation is the likely root cause.', H.primary]
	];
	msgs.forEach((d, i) => {
		const y = 52 + i * 98,
			b = panel(d[0], 500, 78, 10);
		b.strokes = [];
		b.fills = [paint(d[2], 0.07)];
		place(b, txt(d[0], 10, 'SemiBold', 'color/foreground-muted', d[2]), 12, 10);
		const t = txt(d[1], 13, 'Regular');
		t.textAutoResize = 'HEIGHT';
		t.resize(470, 36);
		place(b, t, 12, 31);
		place(stream, b, 16, y);
	});
	const composer = map.get('Prompt Composer').createInstance();
	composer.resize(520, 122);
	place(stream, composer, 16, 650);
	const inspect = panel('Inspector', 308, 790, 14);
	place(s, inspect, 1110, 206);
	place(inspect, txt('Inspector', 15, 'SemiBold'), 16, 16);
	place(inspect, badge('Tool running', 'info'), 16, 50);
	place(inspect, txt('CURRENT TOOL', 10, 'SemiBold', 'color/foreground-muted', H.sub), 16, 102);
	place(inspect, txt('metrics.query', 15, 'SemiBold'), 16, 128);
	const code = panel('Tool input', 276, 126, 8);
	fill(code, 'color/foreground', H.fg);
	code.strokes = [];
	['{', '  metric: "cache_miss_rate",', '  window: "2h"', '}'].forEach((v, i) =>
		place(code, txt(v, 12, 'Regular', 'color/tooltip-foreground', '#fff', true), 12, 12 + i * 24)
	);
	place(inspect, code, 16, 170);
	place(inspect, txt('CONTEXT', 10, 'SemiBold', 'color/foreground-muted', H.sub), 16, 330);
	[
		['Model', 'GPT-5.6'],
		['Tokens', '8,421'],
		['Tools', '3 enabled'],
		['Approvals', 'Safe only']
	].forEach((d, i) => {
		place(inspect, txt(d[0], 12, 'Regular', 'color/foreground-muted', H.sub), 16, 364 + i * 44);
		place(inspect, txt(d[1], 12, 'Medium'), 182, 364 + i * 44);
	});
	return s;
}

function detailScreen() {
	const s = tagged(figma.createFrame());
	s.name = '03 · Run Detail';
	s.resize(1440, 1024);
	fill(s, 'color/background', H.bg);
	s.clipsContent = true;
	nav(s, 'Runs');
	top(s, 'RUN HISTORY', 'Run details', 'Completed 10:42 AM');
	place(s, txt('Runs  /  run_8D13', 12, 'Medium', 'color/foreground-muted', H.sub), 252, 100);
	heading(s, 'Checkout incident analysis', 'Research Agent · Production workspace', 252, 130);
	place(s, badge('Completed', 'success'), 252, 198);
	place(s, button('Export trace', 'wide'), 1220, 144);
	place(s, button('Rerun', 'primary'), 1330, 144);
	const summary = panel('Run summary', 1166, 132, 14);
	place(s, summary, 252, 242);
	[
		['Duration', '8m 14s'],
		['Steps', '6 / 6'],
		['Tool calls', '12'],
		['Tokens', '14,882'],
		['Cost', '$0.84']
	].forEach((d, i) => {
		const x = 24 + i * 220;
		place(summary, txt(d[0], 11, 'Medium', 'color/foreground-muted', H.sub), x, 24);
		place(summary, txt(d[1], 22, 'SemiBold'), x, 54);
	});
	const timeline = panel('Audit timeline', 744, 574, 14);
	place(s, timeline, 252, 398);
	place(timeline, txt('Audit timeline', 16, 'SemiBold'), 18, 18);
	place(
		timeline,
		txt(
			'Every action and decision in chronological order',
			12,
			'Regular',
			'color/foreground-muted',
			H.sub
		),
		18,
		44
	);
	const events = [
		['10:34:08', 'Run started', 'Objective received in Production.', H.primary],
		['10:34:19', 'Traces collected', '182 requests with 27 failures.', H.success],
		['10:35:42', 'Deployment diff inspected', 'Cart cache invalidation changed.', H.success],
		['10:37:16', 'Metrics queried', 'Cache miss rate increased 42%.', H.success],
		['10:39:51', 'Hypothesis validated', 'Replay confirmed stale snapshots.', H.success],
		['10:42:22', 'Run completed', 'Summary and rollback produced.', H.success]
	];
	events.forEach((d, i) => {
		const y = 82 + i * 78;
		place(timeline, txt(d[0], 11, 'Medium', 'color/foreground-muted', H.sub), 18, y);
		place(timeline, circle(d[3], 11), 104, y + 1);
		place(timeline, txt(d[1], 14, 'SemiBold'), 132, y - 4);
		place(timeline, txt(d[2], 13, 'Regular', 'color/foreground-muted', H.sub), 132, y + 22);
	});
	const out = panel('Outcome', 398, 574, 14);
	place(s, out, 1020, 398);
	place(out, txt('Outcome', 16, 'SemiBold'), 18, 18);
	place(out, badge('High confidence', 'success'), 18, 52);
	const finding = txt(
		'Delayed cart-cache invalidation caused sessions to read stale snapshots after the deployment.',
		14,
		'Regular'
	);
	finding.textAutoResize = 'HEIGHT';
	finding.resize(350, 80);
	place(out, finding, 18, 98);
	place(out, txt('Recommendation', 12, 'SemiBold', 'color/foreground-muted', H.sub), 18, 196);
	const rec = txt(
		'Roll back the invalidation change, then replay the failed checkout cohort.',
		14,
		'Regular'
	);
	rec.textAutoResize = 'HEIGHT';
	rec.resize(350, 64);
	place(out, rec, 18, 224);
	place(out, line(362), 18, 310);
	place(out, txt('Policy & approvals', 16, 'SemiBold'), 18, 340);
	[
		['File access', 'Read only'],
		['Network', 'Allowed'],
		['Shell', 'Approved once'],
		['Retention', '30 days']
	].forEach((d, i) => {
		place(out, txt(d[0], 13, 'Regular', 'color/foreground-muted', H.sub), 18, 382 + i * 42);
		place(out, txt(d[1], 13, 'Medium'), 244, 382 + i * 42);
	});
	return s;
}

async function examplesPage(map) {
	const p = await page('Examples');
	await figma.setCurrentPageAsync(p);
	clear(p);
	const h = tagged(txt('Sivir Orbit · AI Agent Orchestration', 34, 'SemiBold'));
	h.x = 80;
	h.y = 60;
	p.appendChild(h);
	const sub = tagged(
		txt(
			'Three editable desktop screens assembled from Sivir components',
			16,
			'Regular',
			'color/foreground-muted',
			H.sub
		)
	);
	sub.x = 80;
	sub.y = 108;
	p.appendChild(sub);
	const screens = [fleetScreen(map), liveScreen(map), detailScreen()];
	screens.forEach((s, i) => {
		s.x = 80 + i * 1520;
		s.y = 170;
		p.appendChild(s);
	});
	return [p, screens];
}

async function main() {
	await figma.loadFontAsync({ family: 'DM Sans', style: 'Regular' });
	await figma.loadFontAsync({ family: 'DM Sans', style: 'Medium' });
	await figma.loadFontAsync({ family: 'DM Sans', style: 'SemiBold' });
	await figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Regular' });
	await foundations();
	await styles();
	await foundationPage();
	const built = await componentPage();
	const result = await examplesPage(built.map);
	const count = built.p.findAll((n) => n.type === 'COMPONENT' && NAMES.includes(n.name)).length;
	if (count !== 50) throw new Error('Expected 50 components, found ' + count);
	await figma.setCurrentPageAsync(result[0]);
	figma.currentPage.selection = result[1];
	figma.viewport.scrollAndZoomIntoView(result[1]);
	figma.closePlugin('Sivir UI ready · 50 components · 3 example screens');
}
main().catch((e) => {
	console.error(e);
	figma.closePlugin('Sivir generator failed: ' + (e && e.message ? e.message : String(e)));
});
