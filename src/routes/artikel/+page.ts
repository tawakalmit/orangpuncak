import { getArticles } from '$lib/data';
import type { PageLoad } from './$types';

const LIMIT = 6;

export const load: PageLoad = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() || undefined;
	const tag = url.searchParams.get('tag')?.trim() || undefined;

	// Ambil semua tags dari seluruh artikel (tanpa filter)
	const { articles: all } = await getArticles({ limit: 1000 });
	const tags = Array.from(new Set(all.flatMap((a) => a.tags ?? []))).sort();

	// Halaman pertama (6 artikel)
	const { articles, hasMore } = await getArticles({ q, tag, page: 0, limit: LIMIT });

	return { articles, hasMore, tags, filter: { q: q ?? '', tag: tag ?? '' } };
};
