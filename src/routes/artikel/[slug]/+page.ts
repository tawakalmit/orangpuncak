import { getArticleBySlug, getArticles } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const article = await getArticleBySlug(params.slug);
	if (!article) throw error(404, 'Artikel tidak ditemukan');
	const all = await getArticles();
	const related = all.filter((a) => a.slug !== params.slug).slice(0, 3);
	return { article, related };
};
