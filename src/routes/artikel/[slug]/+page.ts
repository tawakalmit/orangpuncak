import { getArticleBySlug, getArticles, getPlacesByIds } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const article = await getArticleBySlug(params.slug);
	if (!article) throw error(404, 'Artikel tidak ditemukan');
	const all = await getArticles();
	const related = all.filter((a) => a.slug !== params.slug).slice(0, 3);

	// Fetch related places
	const [relatedVilla, relatedWisata, relatedKuliner] = await Promise.all([
		getPlacesByIds(article.related_villa_ids ?? []),
		getPlacesByIds(article.related_wisata_ids ?? []),
		getPlacesByIds(article.related_kuliner_ids ?? [])
	]);

	return { article, related, relatedVilla, relatedWisata, relatedKuliner };
};
