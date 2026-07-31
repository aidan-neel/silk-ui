import { status } from 'elysia';
import { prisma } from '@lib/prisma';
import { parseTheme } from '@sivir-ui/svelte/themes/theme';
import type { Theme, ThemeRecord } from './model';
import { defaultThemeRecord, defaultThemes, findDefaultTheme, isDefaultSlug } from './defaults';

type PersistedTheme = Awaited<ReturnType<typeof prisma.theme.findFirst>>;

function toIso(value: Date | string): string {
	return value instanceof Date ? value.toISOString() : value;
}

function serialize(theme: NonNullable<PersistedTheme>): ThemeRecord {
	const row = theme as unknown as {
		id: string;
		version: number;
		slug: string;
		name: string;
		description: string;
		publisher: string | null;
		brand: string;
		neutral: string;
		radius: string;
		density: string;
		motionFeel: string;
		fontSans: string;
		fontMono: string;
		fontHeader: string;
		createdAt: Date | string;
		updatedAt: Date | string;
	};
	const parsed = parseTheme({
		version: row.version,
		slug: row.slug,
		name: row.name,
		description: row.description,
		publisher: row.publisher ?? undefined,
		brand: row.brand,
		neutral: row.neutral,
		radius: row.radius,
		density: row.density,
		motion: row.motionFeel,
		fontSans: row.fontSans,
		fontMono: row.fontMono,
		fontHeader: row.fontHeader
	});
	return {
		...parsed,
		id: row.id,
		createdAt: toIso(row.createdAt),
		updatedAt: toIso(row.updatedAt)
	};
}

export async function listThemes(): Promise<ThemeRecord[]> {
	const [rows, hidden] = await Promise.all([
		prisma.theme.findMany({ orderBy: { name: 'asc' } }),
		prisma.hiddenDefault.findMany({ select: { slug: true } })
	]);
	const published = rows.map(serialize);
	const publishedSlugs = new Set(published.map((theme) => theme.slug));
	const hiddenSlugs = new Set(hidden.map((row) => row.slug));
	const unshadowedDefaults = defaultThemes
		.filter((theme) => !publishedSlugs.has(theme.slug) && !hiddenSlugs.has(theme.slug))
		.map(defaultThemeRecord);

	return [...unshadowedDefaults, ...published].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getThemeBySlug(slug: string): Promise<ThemeRecord> {
	const builtIn = findDefaultTheme(slug);
	if (builtIn) return defaultThemeRecord(builtIn);

	const theme = await prisma.theme.findUnique({ where: { slug } });
	if (!theme) {
		throw status(404, 'A theme with this slug does not exist.' as const);
	}

	return serialize(theme);
}

export async function publishTheme(input: Theme) {
	const theme = parseTheme(input);
	if (isDefaultSlug(theme.slug)) {
		throw status(409, 'This slug is reserved for a built-in theme.' as const);
	}

	const existing = await prisma.theme.findUnique({
		where: { slug: theme.slug },
		select: { id: true }
	});
	if (existing) {
		throw status(409, 'A theme with this slug already exists, try another one.' as const);
	}

	try {
		await prisma.theme.create({
			data: {
				version: theme.version,
				slug: theme.slug,
				name: theme.name,
				description: theme.description,
				publisher: theme.publisher ?? null,
				brand: theme.brand,
				neutral: theme.neutral,
				radius: theme.radius,
				density: theme.density,
				motionFeel: theme.motion,
				fontSans: theme.fontSans,
				fontMono: theme.fontMono,
				fontHeader: theme.fontHeader
			} as never
		});
	} catch (error) {
		// Prisma's generated error class can be duplicated across adapters/builds,
		// so the stable public `code` is safer than an instanceof check.
		if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
			throw status(409, 'A theme with this slug already exists, try another one.' as const);
		}
		throw error;
	}

	return {
		success: true as const,
		message: 'Successfully published theme!' as const
	};
}
