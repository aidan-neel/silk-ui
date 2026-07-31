import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { parseTheme, type Theme, type ThemeRecord } from '@sivir-ui/svelte/themes/theme';

export type RegistryTheme = ThemeRecord;

const DEFAULT_REGISTRY_URL = 'http://localhost:4100';

export class RegistryRequestError extends Error {
	constructor(
		public readonly status: number,
		message: string
	) {
		super(message);
	}
}

function getRegistryBaseUrl() {
	const configured = env.THEME_REGISTRY_URL?.trim();
	if (configured) return configured.replace(/\/+$/, '');
	// Local full-stack default only. v1 public docs do not require a registry;
	// callers should catch and fall back (see themes/+page.server.ts).
	if (dev) return DEFAULT_REGISTRY_URL;
	throw new RegistryRequestError(503, 'Theme registry is not configured.');
}

async function parseErrorMessage(response: Response) {
	const body = await response.text();
	return body.trim() || `Registry request failed with status ${response.status}`;
}

function parseRegistryTheme(value: unknown): RegistryTheme {
	if (typeof value !== 'object' || value === null) {
		throw new TypeError('Theme registry returned a non-object record.');
	}
	const record = value as Record<string, unknown>;
	const theme = parseTheme(record);
	if (
		typeof record.id !== 'string' ||
		typeof record.createdAt !== 'string' ||
		typeof record.updatedAt !== 'string'
	) {
		throw new TypeError('Theme registry returned invalid record metadata.');
	}
	return {
		...theme,
		id: record.id,
		createdAt: record.createdAt,
		updatedAt: record.updatedAt
	};
}

export async function listRegistryThemes(fetchImpl: typeof fetch) {
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes`);
	if (!response.ok) {
		throw new RegistryRequestError(response.status, await parseErrorMessage(response));
	}

	const data: unknown = await response.json();
	if (!Array.isArray(data)) throw new RegistryRequestError(502, 'Theme registry returned no list.');
	try {
		return data.map(parseRegistryTheme).sort((a, b) => a.name.localeCompare(b.name));
	} catch (error) {
		throw new RegistryRequestError(
			502,
			error instanceof Error ? error.message : 'Theme registry returned invalid data.'
		);
	}
}

export async function getRegistryThemeBySlug(fetchImpl: typeof fetch, slug: string) {
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes/${encodeURIComponent(slug)}`);
	if (!response.ok) {
		throw new RegistryRequestError(response.status, await parseErrorMessage(response));
	}

	try {
		return parseRegistryTheme(await response.json());
	} catch (error) {
		throw new RegistryRequestError(
			502,
			error instanceof Error ? error.message : 'Theme registry returned invalid data.'
		);
	}
}

export async function publishRegistryTheme(fetchImpl: typeof fetch, value: unknown) {
	let theme: Theme;
	try {
		theme = parseTheme(value);
	} catch (error) {
		throw new RegistryRequestError(
			400,
			error instanceof Error ? error.message : 'Invalid version-2 theme.'
		);
	}
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(theme)
	});

	if (!response.ok) {
		throw new RegistryRequestError(response.status, await parseErrorMessage(response));
	}

	return (await response.json()) as {
		success: boolean;
		message: 'Successfully published theme!';
	};
}
