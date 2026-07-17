import { json } from '@sveltejs/kit';
import { getArticles } from '$lib/data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() || undefined;
	const tag = url.searchParams.get('tag')?.trim() || undefined;
	const page = parseInt(url.searchParams.get('page') ?? '0', 10);

	const { articles, hasMore } = await getArticles({ q, tag, page, limit: 6 });
	return json({ articles, hasMore });
};
