/* Sivir UI — deterministic light-first Figma library generator. */

const GENERATOR_KEY = 'sivir-ui-generator';
const GENERATOR_VERSION = '1';

const C = {
	background: '#fdfdfc',
	card: '#ffffff',
	muted: '#f8f8f5',
	secondary: '#f0f0ed',
	border: '#e8e8e3',
	borderStrong: '#d4d4ce',
	foreground: '#1d1d1a',
	foregroundMuted: '#6e6e68',
	primary: '#1f9be6',
	primaryHover: '#1270ad',
	accentTint: '#eef4ff',
	success: '#43a66f',
	warning: '#c98a2b',
	error: '#d05050',
	info: '#4a9eff',
	tooltip: '#1d1d1a',
	overlay: '#0000002e'
};

const COMPONENTS = [
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

function rgba(hex, alpha) {
	const clean = hex.replace('#', '');
	const expanded =
		clean.length === 3
			? clean
					.split('')
					.map((x) => x + x)
					.join('')
			: clean.slice(0, 6);
	const parsedAlpha = clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1;
	return {
		r: parseInt(expanded.slice(0, 2), 16) / 255,
		g: parseInt(expanded.slice(2, 4), 16) / 255,
		b: parseInt(expanded.slice(4, 6), 16) / 255,
		a: alpha === undefined ? parsedAlpha : alpha
	};
}

function solid(hex, alpha) {
	const color = rgba(hex, alpha);
	return { type: 'SOLID', color: { r: color.r, g: color.g, b: color.b }, opacity: color.a };
}

function hsl(h, s, l, a) {
	s /= 100;
	l /= 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0,
		g = 0,
		b = 0;
	if (h < 60) {
		r = c;
		g = x;
	} else if (h < 120) {
		r = x;
		g = c;
	} else if (h < 180) {
		g = c;
		b = x;
	} else if (h < 240) {
		g = x;
		b = c;
	} else if (h < 300) {
		r = x;
		b = c;
	} else {
		r = c;
		b = x;
	}
	return { r: r + m, g: g + m, b: b + m, a: a === undefined ? 1 : a };
}

function mark(node) {
	node.setPluginData(GENERATOR_KEY, GENERATOR_VERSION);
	return node;
}

async function pageNamed(name) {
	let page = figma.root.children.find((item) => item.type === 'PAGE' && item.name === name);
	if (!page) {
		const blank = figma.root.children.find(
			(item) => item.type === 'PAGE' && item.name === 'Page 1' && item.children.length === 0
		);
		page = blank || figma.createPage();
		page.name = name;
	}
	return page;
}

function clearGenerated(page) {
	for (const node of [...page.children]) {
		if (node.getPluginData(GENERATOR_KEY) === GENERATOR_VERSION) node.remove();
	}
}

async function ensureCollection(name) {
	const collections = await figma.variables.getLocalVariableCollectionsAsync();
	let collection = collections.find((item) => item.name === name);
	if (!collection) collection = figma.variables.createVariableCollection(name);
	const modeId = collection.modes[0].modeId;
	if (collection.modes[0].name !== 'Value') collection.renameMode(modeId, 'Value');
	return { collection, modeId };
}

async function ensureVariable(collection, modeId, name, type, value, cssName, scopes, description) {
	const variables = await figma.variables.getLocalVariablesAsync(type);
	let variable = variables.find(
		(item) => item.variableCollectionId === collection.id && item.name === name
	);
	if (!variable) variable = figma.variables.createVariable(name, collection, type);
	variable.description = description || cssName || name;
	variable.scopes = scopes || [];
	variable.setValueForMode(modeId, value);
	if (cssName) variable.setVariableCodeSyntax('WEB', 'var(' + cssName + ')');
	return variable;
}

async function buildVariables() {
	const primitivesInfo = await ensureCollection('Color Primitives');
	const colorInfo = await ensureCollection('Color');
	const spacingInfo = await ensureCollection('Spacing & Size');
	const radiusInfo = await ensureCollection('Radius & Border');
	const typographyInfo = await ensureCollection('Typography');
	const motionInfo = await ensureCollection('Motion');

	const rawDefs = [
		['neutral/0', hsl(0, 0, 100), '--sivir-neutral-0'],
		['neutral/10', hsl(60, 11.1, 99.2), '--sivir-neutral-10'],
		['neutral/50', hsl(60, 11.1, 96.5), '--sivir-neutral-50'],
		['neutral/100', hsl(60, 6.2, 93.7), '--sivir-neutral-100'],
		['neutral/150', hsl(60, 4.2, 90.6), '--sivir-neutral-150'],
		['neutral/300', hsl(60, 4.4, 82.4), '--sivir-neutral-300'],
		['neutral/500', hsl(60, 3, 42), '--sivir-neutral-500'],
		['neutral/900', hsl(60, 5.7, 10.4), '--sivir-neutral-900'],
		['blue/50', hsl(218.8, 100, 96.7), '--sivir-blue-50'],
		['blue/500', hsl(212.2, 100, 64.5), '--sivir-blue-500'],
		['status/success', hsl(148.7, 42.2, 42.7), '--sivir-success'],
		['status/warning', hsl(36.1, 64.8, 47.8), '--sivir-warning'],
		['status/error', hsl(0, 57.7, 56.5), '--sivir-error'],
		['brand/primary', rgba(C.primary), '--color-primary'],
		['brand/primary-hover', rgba(C.primaryHover), '--color-primary-hover'],
		['brand/ring-30', rgba(C.primary, 0.3), '--color-ring'],
		['black/overlay-18', rgba('#000000', 0.18), '--color-overlay']
	];
	const raw = new Map();
	for (const [name, value, css] of rawDefs) {
		raw.set(
			name,
			await ensureVariable(
				primitivesInfo.collection,
				primitivesInfo.modeId,
				name,
				'COLOR',
				value,
				css,
				[],
				'Raw Sivir color source'
			)
		);
	}

	const codeSources = [
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
	const colors = new Map();
	for (const [name, source, css] of codeSources) {
		colors.set(
			name,
			await ensureVariable(
				colorInfo.collection,
				colorInfo.modeId,
				name,
				'COLOR',
				figma.variables.createVariableAlias(raw.get(source)),
				css,
				[],
				'Code-facing Sivir source token'
			)
		);
	}

	const fill = ['FRAME_FILL', 'SHAPE_FILL'];
	const textFill = ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR'];
	const broad = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'];
	const semantics = [
		['color/background', colors.get('sivir/neutral/10'), '--color-background', fill],
		['color/card', colors.get('sivir/neutral/0'), '--color-card', fill],
		['color/panel', colors.get('sivir/neutral/0'), '--color-panel', fill],
		['color/muted', colors.get('sivir/neutral/50'), '--color-muted', fill],
		['color/secondary', colors.get('sivir/neutral/100'), '--color-secondary', fill],
		['color/border', colors.get('sivir/neutral/150'), '--color-border', ['STROKE_COLOR']],
		[
			'color/border-strong',
			colors.get('sivir/neutral/300'),
			'--color-border-strong',
			['STROKE_COLOR']
		],
		['color/input', colors.get('sivir/neutral/300'), '--color-input', ['STROKE_COLOR']],
		['color/foreground', colors.get('sivir/neutral/900'), '--color-foreground', textFill],
		[
			'color/foreground-muted',
			colors.get('sivir/neutral/500'),
			'--color-foreground-muted',
			textFill
		],
		['color/primary', raw.get('brand/primary'), '--color-primary', broad],
		['color/primary-hover', raw.get('brand/primary-hover'), '--color-primary-hover', broad],
		[
			'color/on-primary',
			colors.get('sivir/neutral/0'),
			'--color-on-primary',
			['TEXT_FILL', 'SHAPE_FILL']
		],
		['color/accent-tint', colors.get('sivir/blue/50'), '--color-accent-tint', fill],
		['color/ring', raw.get('brand/ring-30'), '--color-ring', ['STROKE_COLOR', 'EFFECT_COLOR']],
		['color/overlay', raw.get('black/overlay-18'), '--color-overlay', fill],
		['color/success', colors.get('sivir/success'), '--color-success', broad],
		['color/warning', colors.get('sivir/warning'), '--color-warning', broad],
		['color/error', colors.get('sivir/error'), '--color-error', broad],
		['color/info', colors.get('sivir/blue/500'), '--color-info', broad],
		['color/tooltip', colors.get('sivir/neutral/900'), '--color-tooltip', fill],
		[
			'color/tooltip-foreground',
			colors.get('sivir/neutral/0'),
			'--color-tooltip-foreground',
			['TEXT_FILL', 'SHAPE_FILL']
		]
	];
	for (const [name, source, css, scopes] of semantics) {
		colors.set(
			name,
			await ensureVariable(
				colorInfo.collection,
				colorInfo.modeId,
				name,
				'COLOR',
				figma.variables.createVariableAlias(source),
				css,
				scopes,
				'Sivir semantic color token'
			)
		);
	}
	const chained = [
		['color/field', 'color/card', '--color-field', fill],
		['color/field-hover', 'color/muted', '--color-field-hover', fill],
		['color/field-foreground', 'color/foreground', '--color-field-foreground', textFill]
	];
	for (const [name, source, css, scopes] of chained) {
		colors.set(
			name,
			await ensureVariable(
				colorInfo.collection,
				colorInfo.modeId,
				name,
				'COLOR',
				figma.variables.createVariableAlias(colors.get(source)),
				css,
				scopes,
				'Sivir semantic field token'
			)
		);
	}

	const spacingDefs = [
		['sivir/space-unit', 3.6, '--sivir-space-unit', ['GAP']],
		['sivir/space/1', 3.6, '--sivir-space-1', ['GAP']],
		['sivir/space/2', 7.2, '--sivir-space-2', ['GAP']],
		['sivir/space/3', 10.8, '--sivir-space-3', ['GAP']],
		['sivir/space/4', 14.4, '--sivir-space-4', ['GAP']],
		['sivir/space/5', 18, '--sivir-space-5', ['GAP']],
		['sivir/space/6', 21.6, '--sivir-space-6', ['GAP']],
		['sivir/space/8', 28.8, '--sivir-space-8', ['GAP']],
		['sivir/space/10', 36, '--sivir-space-10', ['GAP']],
		['size/control-sm', 28.8, '--size-control-sm', ['WIDTH_HEIGHT']],
		['size/control-md', 36, '--size-control-md', ['WIDTH_HEIGHT']],
		['size/control-lg', 36, '--size-control-lg', ['WIDTH_HEIGHT']],
		['size/icon-md', 28.8, '--size-icon-md', ['WIDTH_HEIGHT']]
	];
	for (const def of spacingDefs)
		await ensureVariable(
			spacingInfo.collection,
			spacingInfo.modeId,
			def[0],
			'FLOAT',
			def[1],
			def[2],
			def[3],
			'Sivir spacing and size token'
		);

	const radiusDefs = [
		['radius/sm', 6, '--radius-sm', ['CORNER_RADIUS']],
		['radius/md', 8, '--radius-md', ['CORNER_RADIUS']],
		['radius/lg', 10, '--radius-lg', ['CORNER_RADIUS']],
		['radius/xl', 14, '--radius-xl', ['CORNER_RADIUS']],
		['border/size', 1, '--border-size', ['STROKE_FLOAT']]
	];
	for (const def of radiusDefs)
		await ensureVariable(
			radiusInfo.collection,
			radiusInfo.modeId,
			def[0],
			'FLOAT',
			def[1],
			def[2],
			def[3],
			'Sivir radius and border token'
		);

	const typeDefs = [
		['font/sans', 'STRING', 'DM Sans', '--font-sans', ['FONT_FAMILY']],
		['font/mono', 'STRING', 'JetBrains Mono', '--font-mono', ['FONT_FAMILY']],
		['font/header', 'STRING', 'DM Sans', '--font-header', ['FONT_FAMILY']],
		['text/xs', 'FLOAT', 12, '--text-xs', ['FONT_SIZE']],
		['text/sm', 'FLOAT', 14, '--text-sm', ['FONT_SIZE']],
		['text/base', 'FLOAT', 14, '--text-base', ['FONT_SIZE']],
		['font-size/header', 'FLOAT', 16, '--font-size-header', ['FONT_SIZE']],
		['font-size/body', 'FLOAT', 14, '--font-size-body', ['FONT_SIZE']],
		['font-size/label', 'FLOAT', 13, '--font-size-label', ['FONT_SIZE']],
		['font-size/button', 'FLOAT', 14, '--font-size-button', ['FONT_SIZE']],
		['font-size/badge', 'FLOAT', 12, '--font-size-badge', ['FONT_SIZE']],
		['font-weight/header', 'FLOAT', 600, '--font-weight-header', ['FONT_WEIGHT']],
		['font-weight/body', 'FLOAT', 400, '--font-weight-body', ['FONT_WEIGHT']],
		['font-weight/label', 'FLOAT', 500, '--font-weight-label', ['FONT_WEIGHT']],
		['font-weight/button', 'FLOAT', 500, '--font-weight-button', ['FONT_WEIGHT']],
		['font-weight/badge', 'FLOAT', 500, '--font-weight-badge', ['FONT_WEIGHT']],
		['font-weight/description', 'FLOAT', 400, '--font-weight-description', ['FONT_WEIGHT']],
		['tracking/header', 'FLOAT', -1.5, '--tracking-header', ['LETTER_SPACING']],
		['tracking/body', 'FLOAT', 0, '--tracking-body', ['LETTER_SPACING']],
		['tracking/label', 'FLOAT', 0, '--tracking-label', ['LETTER_SPACING']],
		['tracking/button', 'FLOAT', 0, '--tracking-button', ['LETTER_SPACING']],
		['tracking/badge', 'FLOAT', 0, '--tracking-badge', ['LETTER_SPACING']]
	];
	for (const def of typeDefs)
		await ensureVariable(
			typographyInfo.collection,
			typographyInfo.modeId,
			def[0],
			def[1],
			def[2],
			def[3],
			def[4],
			'Sivir typography token'
		);

	const motionDefs = [
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
	for (const def of motionDefs)
		await ensureVariable(
			motionInfo.collection,
			motionInfo.modeId,
			def[0],
			def[1],
			def[2],
			def[3],
			[],
			'Sivir motion token'
		);
	return colors;
}

async function ensureTextStyle(name, family, style, size, tracking) {
	const styles = await figma.getLocalTextStylesAsync();
	let textStyle = styles.find((item) => item.name === name);
	if (!textStyle) textStyle = figma.createTextStyle();
	textStyle.name = name;
	textStyle.fontName = { family, style };
	textStyle.fontSize = size;
	textStyle.lineHeight = { unit: 'AUTO' };
	textStyle.letterSpacing = { unit: 'PERCENT', value: tracking || 0 };
	return textStyle;
}

async function buildStyles() {
	await ensureTextStyle('Sivir/Header', 'DM Sans', 'SemiBold', 16, -1.5);
	await ensureTextStyle('Sivir/Body', 'DM Sans', 'Regular', 14, 0);
	await ensureTextStyle('Sivir/Label', 'DM Sans', 'Medium', 13, 0);
	await ensureTextStyle('Sivir/Button', 'DM Sans', 'Medium', 14, 0);
	await ensureTextStyle('Sivir/Badge', 'DM Sans', 'Medium', 12, 0);
	await ensureTextStyle('Sivir/Code', 'JetBrains Mono', 'Regular', 14, 0);

	const styles = await figma.getLocalEffectStylesAsync();
	function effect(name, effects) {
		let style = styles.find((item) => item.name === name);
		if (!style) style = figma.createEffectStyle();
		style.name = name;
		style.effects = effects;
	}
	effect('Sivir/Elevation 1', [
		{
			type: 'DROP_SHADOW',
			color: rgba('#000000', 0.04),
			offset: { x: 0, y: 4 },
			radius: 2,
			spread: 0,
			visible: true,
			blendMode: 'NORMAL'
		}
	]);
	effect('Sivir/Elevation Float', [
		{
			type: 'DROP_SHADOW',
			color: rgba('#000000', 0.12),
			offset: { x: 0, y: 8 },
			radius: 24,
			spread: -8,
			visible: true,
			blendMode: 'NORMAL'
		},
		{
			type: 'DROP_SHADOW',
			color: rgba('#000000', 0.06),
			offset: { x: 0, y: 2 },
			radius: 6,
			spread: 0,
			visible: true,
			blendMode: 'NORMAL'
		}
	]);
	effect('Sivir/Elevation Control', [
		{
			type: 'INNER_SHADOW',
			color: rgba(C.border),
			offset: { x: 0, y: 0 },
			radius: 0,
			spread: 1,
			visible: true,
			blendMode: 'NORMAL'
		},
		{
			type: 'INNER_SHADOW',
			color: rgba('#0f0f10', 0.08),
			offset: { x: 0, y: -2 },
			radius: 3,
			spread: -2,
			visible: true,
			blendMode: 'NORMAL'
		},
		{
			type: 'INNER_SHADOW',
			color: rgba('#ffffff', 0.4),
			offset: { x: 0, y: 1 },
			radius: 0,
			spread: 0,
			visible: true,
			blendMode: 'NORMAL'
		}
	]);
	effect('Sivir/Focus Ring', [
		{
			type: 'DROP_SHADOW',
			color: rgba(C.primary, 0.3),
			offset: { x: 0, y: 0 },
			radius: 0,
			spread: 3,
			visible: true,
			blendMode: 'NORMAL'
		}
	]);
}

let COLOR_VARS = new Map();

function boundPaint(hex, variableName, alpha) {
	const paint = solid(hex, alpha);
	const variable = COLOR_VARS.get(variableName);
	return variable ? figma.variables.setBoundVariableForPaint(paint, 'color', variable) : paint;
}

function setFill(node, variableName, fallback, alpha) {
	node.fills = [boundPaint(fallback, variableName, alpha)];
}

function setStroke(node, variableName, fallback) {
	node.strokes = [boundPaint(fallback, variableName)];
	node.strokeWeight = 1;
}

function text(value, size, weight, variableName, color, mono) {
	const node = figma.createText();
	node.fontName = { family: mono ? 'JetBrains Mono' : 'DM Sans', style: weight || 'Regular' };
	node.fontSize = size || 14;
	node.characters = value;
	node.textAutoResize = 'WIDTH_AND_HEIGHT';
	setFill(node, variableName || 'color/foreground', color || C.foreground);
	return node;
}

function frame(name, direction, gap, padding) {
	const node = figma.createFrame();
	node.name = name;
	node.layoutMode = direction || 'VERTICAL';
	node.itemSpacing = gap === undefined ? 8 : gap;
	const p = padding === undefined ? 0 : padding;
	node.paddingTop = p;
	node.paddingRight = p;
	node.paddingBottom = p;
	node.paddingLeft = p;
	node.primaryAxisSizingMode = 'AUTO';
	node.counterAxisSizingMode = 'AUTO';
	node.fills = [];
	return node;
}

function row(name, gap) {
	const node = frame(name || 'Row', 'HORIZONTAL', gap === undefined ? 8 : gap, 0);
	node.counterAxisAlignItems = 'CENTER';
	return node;
}

function dot(color, size) {
	const node = figma.createEllipse();
	node.resize(size || 8, size || 8);
	node.fills = [solid(color)];
	return node;
}

function divider(width) {
	const node = figma.createRectangle();
	node.resize(width || 240, 1);
	setFill(node, 'color/border', C.border);
	return node;
}

function button(label, kind, width) {
	const node = frame('Button', 'HORIZONTAL', 6, 10);
	node.paddingTop = 9;
	node.paddingBottom = 9;
	node.cornerRadius = 8;
	node.counterAxisAlignItems = 'CENTER';
	node.primaryAxisAlignItems = 'CENTER';
	if (kind === 'primary') {
		setFill(node, 'color/primary', C.primary);
		node.appendChild(text(label, 14, 'Medium', 'color/on-primary', '#ffffff'));
	} else if (kind === 'danger') {
		setFill(node, 'color/error', C.error);
		node.appendChild(text(label, 14, 'Medium', 'color/on-primary', '#ffffff'));
	} else {
		setFill(node, 'color/card', C.card);
		setStroke(node, 'color/border', C.border);
		node.appendChild(text(label, 14, 'Medium'));
	}
	if (width) node.resize(width, 36);
	return node;
}

function pill(label, tone) {
	const map = {
		success: [C.success, 'color/success'],
		warning: [C.warning, 'color/warning'],
		error: [C.error, 'color/error'],
		info: [C.info, 'color/info'],
		neutral: [C.foregroundMuted, 'color/foreground-muted']
	};
	const pair = map[tone] || map.neutral;
	const node = frame('Badge', 'HORIZONTAL', 6, 7);
	node.paddingTop = 4;
	node.paddingBottom = 4;
	node.cornerRadius = 999;
	node.counterAxisAlignItems = 'CENTER';
	node.fills = [solid(pair[0], 0.11)];
	node.appendChild(dot(pair[0], 6));
	node.appendChild(text(label, 12, 'Medium', pair[1], pair[0]));
	return node;
}

function input(label, width) {
	const node = frame('Input', 'HORIZONTAL', 8, 10);
	node.paddingTop = 9;
	node.paddingBottom = 9;
	node.cornerRadius = 8;
	setFill(node, 'color/field', C.card);
	setStroke(node, 'color/input', C.borderStrong);
	node.appendChild(text(label, 14, 'Regular', 'color/foreground-muted', C.foregroundMuted));
	node.resize(width || 240, 38);
	return node;
}

function surface(name, width, padding) {
	const node = frame(name, 'VERTICAL', 10, padding === undefined ? 14 : padding);
	node.cornerRadius = 10;
	setFill(node, 'color/card', C.card);
	setStroke(node, 'color/border', C.border);
	if (width) node.resize(width, 80);
	return node;
}

function addLines(parent, lines, width, mono) {
	for (const line of lines) {
		const t = text(line, mono ? 12 : 14, 'Regular', 'color/foreground', C.foreground, mono);
		if (width) {
			t.textAutoResize = 'HEIGHT';
			t.resize(width, 18);
		}
		parent.appendChild(t);
	}
}

function createPublicComponent(name) {
	const component = figma.createComponent();
	component.name = name;
	component.description =
		'Sivir UI ' +
		name +
		' — generated from the public Svelte component and bound to Sivir semantic tokens.';
	component.layoutMode = 'VERTICAL';
	component.itemSpacing = 10;
	component.paddingTop = 14;
	component.paddingRight = 14;
	component.paddingBottom = 14;
	component.paddingLeft = 14;
	component.primaryAxisSizingMode = 'AUTO';
	component.counterAxisSizingMode = 'FIXED';
	component.resize(280, 80);
	component.cornerRadius = 10;
	setFill(component, 'color/card', C.card);
	setStroke(component, 'color/border', C.border);

	const title = (label) => component.appendChild(text(label, 14, 'SemiBold'));
	const muted = (label) =>
		component.appendChild(text(label, 13, 'Regular', 'color/foreground-muted', C.foregroundMuted));
	const add = (node) => component.appendChild(node);

	switch (name) {
		case 'Accordion':
			title('What can this agent access?');
			muted('Workspace files and approved tools');
			add(divider(250));
			title('How are actions audited?');
			break;
		case 'Alert': {
			const r = row('Alert', 10);
			r.appendChild(dot(C.info, 10));
			const c = frame('Copy', 'VERTICAL', 3, 0);
			c.appendChild(text('Agent connected', 14, 'SemiBold'));
			c.appendChild(
				text(
					'The runtime is ready for tasks.',
					13,
					'Regular',
					'color/foreground-muted',
					C.foregroundMuted
				)
			);
			r.appendChild(c);
			add(r);
			break;
		}
		case 'Alert Dialog':
			title('Stop this run?');
			muted('The agent will finish its active tool call, then stop.');
			{
				const r = row('Actions', 8);
				r.appendChild(button('Cancel'));
				r.appendChild(button('Stop run', 'danger'));
				add(r);
			}
			break;
		case 'Approval Request':
			title('Approval required');
			muted('Deploy Agent wants to run a production command.');
			add(input('npm run deploy', 250));
			{
				const r = row('Actions', 8);
				r.appendChild(button('Deny'));
				r.appendChild(button('Approve', 'primary'));
				add(r);
			}
			break;
		case 'Attachment': {
			const r = row('Attachment', 10);
			r.appendChild(dot(C.primary, 28));
			const c = frame('File', 'VERTICAL', 2, 0);
			c.appendChild(text('run-log.json', 14, 'Medium'));
			c.appendChild(
				text('42 KB · JSON', 12, 'Regular', 'color/foreground-muted', C.foregroundMuted)
			);
			r.appendChild(c);
			add(r);
			break;
		}
		case 'Avatar':
			component.resize(64, 64);
			component.cornerRadius = 999;
			component.paddingTop = 18;
			component.paddingBottom = 18;
			component.paddingLeft = 18;
			component.paddingRight = 18;
			setFill(component, 'color/accent-tint', C.accentTint);
			component.appendChild(text('SA', 18, 'SemiBold', 'color/primary', C.primary));
			break;
		case 'Badge':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			component.resize(92, 26);
			add(pill('Running', 'success'));
			break;
		case 'Breadcrumb':
			component.fills = [];
			component.strokes = [];
			{
				const r = row('Breadcrumb', 8);
				r.appendChild(text('Runs', 13, 'Medium', 'color/foreground-muted', C.foregroundMuted));
				r.appendChild(text('/', 13, 'Regular', 'color/foreground-muted', C.foregroundMuted));
				r.appendChild(text('run_9F2A', 13, 'Medium'));
				add(r);
			}
			break;
		case 'Button':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			component.resize(112, 36);
			add(button('Start run', 'primary'));
			break;
		case 'Card':
			title('Research agent');
			muted('Synthesizes sources and returns cited findings.');
			{
				const r = row('Meta', 8);
				r.appendChild(pill('Online', 'success'));
				r.appendChild(pill('12 runs', 'neutral'));
				add(r);
			}
			break;
		case 'Checkbox': {
			const r = row('Checkbox', 9);
			const box = frame('Checked', 'HORIZONTAL', 0, 0);
			box.resize(18, 18);
			box.cornerRadius = 5;
			setFill(box, 'color/primary', C.primary);
			box.appendChild(text('✓', 12, 'SemiBold', 'color/on-primary', '#ffffff'));
			r.appendChild(box);
			r.appendChild(text('Include tool output', 14, 'Medium'));
			add(r);
			break;
		}
		case 'Code Block':
			setFill(component, 'color/foreground', C.foreground);
			component.strokes = [];
			add(
				text(
					'const result = await agent.run(task)',
					12,
					'Regular',
					'color/tooltip-foreground',
					'#ffffff',
					true
				)
			);
			add(text('return result.output', 12, 'Regular', 'color/tooltip-foreground', '#ffffff', true));
			break;
		case 'Collapsible':
			title('3 completed tool calls');
			muted('▸ Show details');
			break;
		case 'Color Picker':
			title('Agent color');
			{
				const r = row('Swatches', 8);
				[C.primary, C.success, C.warning, C.error, '#8b5cf6'].forEach((color) =>
					r.appendChild(dot(color, 24))
				);
				add(r);
			}
			add(input('#1F9BE6', 250));
			break;
		case 'Combobox':
			title('Assign agent');
			add(input('Search agents…', 250));
			muted('Research Agent');
			muted('Browser Agent');
			break;
		case 'Command':
			add(input('Type a command…', 250));
			title('Actions');
			muted('Start a new run                ⌘↵');
			muted('Open agent fleet              ⌘K');
			break;
		case 'Context Menu':
			muted('Open run');
			muted('Duplicate run');
			add(divider(250));
			muted('Delete run');
			break;
		case 'Conversation':
			title('Agent conversation');
			muted('User · Investigate the checkout failure');
			muted('Agent · I’ll inspect the latest traces and logs.');
			break;
		case 'Copy Button':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			component.resize(86, 36);
			add(button('Copy'));
			break;
		case 'Dropdown Menu':
			muted('Rename agent');
			muted('Duplicate');
			muted('Move to workspace');
			add(divider(250));
			muted('Archive');
			break;
		case 'Fullscreen Nav':
			component.resize(300, 250);
			title('Sivir Orbit');
			['Overview', 'Agent Fleet', 'Runs', 'Evaluations', 'Settings'].forEach((item, i) => {
				const r = row('Nav item', 9);
				r.appendChild(dot(i === 1 ? C.primary : C.foregroundMuted, 8));
				r.appendChild(
					text(
						item,
						14,
						i === 1 ? 'SemiBold' : 'Medium',
						i === 1 ? 'color/primary' : 'color/foreground'
					)
				);
				add(r);
			});
			break;
		case 'Hover Card':
			title('Research Agent');
			muted('Last active 18 seconds ago');
			add(pill('Healthy', 'success'));
			break;
		case 'Input':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			add(input('Agent name', 280));
			break;
		case 'Label':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			add(text('Workspace name', 13, 'Medium'));
			break;
		case 'Markdown':
			title('Run summary');
			muted('The agent completed **4 tool calls** and found 2 issues.');
			add(text('• Retry policy is too aggressive', 14, 'Regular'));
			add(text('• Cache invalidation is delayed', 14, 'Regular'));
			break;
		case 'Message':
			{
				const r = row('Message', 10);
				r.appendChild(dot(C.primary, 30));
				const c = surface('Message bubble', 220, 10);
				c.appendChild(text('I found the failing deployment step.', 14, 'Regular'));
				r.appendChild(c);
				add(r);
			}
			break;
		case 'Modal':
			component.resize(320, 220);
			title('Create agent');
			muted('Configure a reusable agent for your workspace.');
			add(input('Agent name', 290));
			add(input('Model', 290));
			add(button('Create agent', 'primary'));
			break;
		case 'Pagination':
			{
				const r = row('Pagination', 6);
				['‹', '1', '2', '3', '›'].forEach((v) =>
					r.appendChild(button(v, v === '2' ? 'primary' : undefined))
				);
				add(r);
			}
			break;
		case 'Popover':
			title('Run filters');
			muted('Status');
			add(pill('Running', 'success'));
			muted('Agent');
			add(input('All agents', 250));
			break;
		case 'Progress':
			component.fills = [];
			component.strokes = [];
			title('62% complete');
			{
				const track = figma.createFrame();
				track.resize(250, 8);
				track.cornerRadius = 999;
				setFill(track, 'color/secondary', C.secondary);
				const bar = figma.createRectangle();
				bar.resize(155, 8);
				bar.cornerRadius = 999;
				setFill(bar, 'color/primary', C.primary);
				track.appendChild(bar);
				add(track);
			}
			break;
		case 'Prompt Composer':
			component.resize(420, 130);
			muted('Ask an agent to investigate, plan, or act…');
			add(divider(390));
			{
				const r = row('Composer toolbar', 8);
				r.appendChild(button('+'));
				r.appendChild(pill('Research Agent', 'info'));
				r.appendChild(button('Send', 'primary'));
				add(r);
			}
			break;
		case 'Radio Group':
			['Fast · lower cost', 'Balanced · recommended', 'Thorough · higher quality'].forEach(
				(label, i) => {
					const r = row('Radio', 9);
					const ring = figma.createEllipse();
					ring.resize(18, 18);
					ring.fills = i === 1 ? [solid(C.primary)] : [solid(C.card)];
					ring.strokes = [solid(i === 1 ? C.primary : C.borderStrong)];
					ring.strokeWeight = 1;
					r.appendChild(ring);
					r.appendChild(text(label, 14, 'Medium'));
					add(r);
				}
			);
			break;
		case 'Reasoning':
			title('Reasoning');
			muted('Analyzing 14 traces across 3 environments…');
			add(pill('Thinking', 'info'));
			break;
		case 'Response Stream':
			title('Streaming response');
			muted('The most likely root cause is a stale cache entry in…');
			add(pill('Generating', 'info'));
			break;
		case 'Scroll Area':
			component.resize(280, 180);
			for (let i = 1; i <= 6; i++) muted('Run event ' + i + ' · completed');
			break;
		case 'Select':
			title('Model');
			add(input('GPT-5.6  ▾', 250));
			break;
		case 'Sheet':
			component.resize(320, 260);
			title('Run settings');
			muted('Configure behavior for this run.');
			add(input('Max steps · 24', 290));
			add(input('Timeout · 10 min', 290));
			add(button('Save settings', 'primary'));
			break;
		case 'Shortcut':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			{
				const r = row('Shortcut', 4);
				['⌘', 'K'].forEach((key) => {
					const k = surface('Key', 28, 6);
					k.cornerRadius = 6;
					k.appendChild(text(key, 12, 'Medium'));
					r.appendChild(k);
				});
				add(r);
			}
			break;
		case 'Skeleton':
			component.strokes = [];
			setFill(component, 'color/muted', C.muted);
			{
				[150, 230, 190].forEach((w) => {
					const s = figma.createRectangle();
					s.resize(w, 12);
					s.cornerRadius = 6;
					setFill(s, 'color/secondary', C.secondary);
					add(s);
				});
			}
			break;
		case 'Slider':
			title('Temperature · 0.7');
			{
				const track = figma.createFrame();
				track.resize(250, 6);
				track.cornerRadius = 999;
				setFill(track, 'color/secondary', C.secondary);
				const bar = figma.createRectangle();
				bar.resize(175, 6);
				bar.cornerRadius = 999;
				setFill(bar, 'color/primary', C.primary);
				track.appendChild(bar);
				const handle = dot(C.primary, 18);
				handle.x = 165;
				handle.y = -6;
				track.appendChild(handle);
				add(track);
			}
			break;
		case 'Spinner':
			component.fills = [];
			component.strokes = [];
			component.resize(40, 40);
			component.paddingTop = 8;
			component.paddingBottom = 8;
			component.paddingLeft = 8;
			component.paddingRight = 8;
			{
				const ring = figma.createEllipse();
				ring.resize(24, 24);
				ring.fills = [];
				ring.strokes = [solid(C.primary), solid(C.secondary)];
				ring.strokeWeight = 3;
				add(ring);
			}
			break;
		case 'Switch':
			{
				const r = row('Switch', 10);
				const track = figma.createFrame();
				track.resize(38, 22);
				track.cornerRadius = 999;
				setFill(track, 'color/primary', C.primary);
				const knob = dot('#ffffff', 16);
				knob.x = 19;
				knob.y = 3;
				track.appendChild(knob);
				r.appendChild(track);
				r.appendChild(text('Auto-approve safe tools', 14, 'Medium'));
				add(r);
			}
			break;
		case 'Tabs':
			{
				const r = row('Tabs', 4);
				['Overview', 'Trace', 'Output'].forEach((label, i) =>
					r.appendChild(button(label, i === 0 ? 'primary' : undefined))
				);
				add(r);
			}
			break;
		case 'Textarea':
			component.fills = [];
			component.strokes = [];
			{
				const area = surface('Textarea', 280, 10);
				area.resize(280, 96);
				area.appendChild(
					text(
						'Describe the agent’s objective…',
						14,
						'Regular',
						'color/foreground-muted',
						C.foregroundMuted
					)
				);
				add(area);
			}
			break;
		case 'Toast':
			{
				const r = row('Toast', 10);
				r.appendChild(dot(C.success, 10));
				const c = frame('Copy', 'VERTICAL', 2, 0);
				c.appendChild(text('Run completed', 14, 'SemiBold'));
				c.appendChild(
					text(
						'All 12 steps finished successfully.',
						13,
						'Regular',
						'color/foreground-muted',
						C.foregroundMuted
					)
				);
				r.appendChild(c);
				add(r);
			}
			break;
		case 'Toggle':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			add(button('Trace', 'primary'));
			break;
		case 'Toggle Group':
			{
				const r = row('Toggle Group', 4);
				['Day', 'Week', 'Month'].forEach((label, i) =>
					r.appendChild(button(label, i === 1 ? 'primary' : undefined))
				);
				add(r);
			}
			break;
		case 'Tool':
			title('browser.search');
			muted('{ query: “Sivir UI component API” }');
			add(pill('Completed · 1.2s', 'success'));
			break;
		case 'Toolbar':
			{
				const r = row('Toolbar', 6);
				['Undo', 'Redo', 'Copy', 'Share'].forEach((label) => r.appendChild(button(label)));
				add(r);
			}
			break;
		case 'Tooltip':
			component.fills = [];
			component.strokes = [];
			component.paddingTop = 0;
			component.paddingBottom = 0;
			component.paddingLeft = 0;
			component.paddingRight = 0;
			{
				const tip = frame('Tooltip', 'HORIZONTAL', 0, 8);
				tip.paddingTop = 6;
				tip.paddingBottom = 6;
				tip.cornerRadius = 8;
				setFill(tip, 'color/tooltip', C.tooltip);
				tip.appendChild(
					text('Open run details', 13, 'Medium', 'color/tooltip-foreground', '#ffffff')
				);
				add(tip);
			}
			break;
	}
	return mark(component);
}
