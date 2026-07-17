import { getArticleBySlug, getArticles, getPlacesByIds, getRandomPlaces } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const article = await getArticleBySlug(params.slug);
	if (!article) throw error(404, 'Artikel tidak ditemukan');

	const { articles: all } = await getArticles({ limit: 1000 });
	const related = all.filter((a) => a.slug !== params.slug && a.id !== article.id).slice(0, 3);

	const isHub = article.template === 'hub';

	const [relatedVilla, relatedWisata, relatedKuliner] = await Promise.all([
		getPlacesByIds((article.related_villa_ids ?? []).slice(0, isHub ? 20 : undefined)),
		getPlacesByIds((article.related_wisata_ids ?? []).slice(0, isHub ? 20 : undefined)),
		getPlacesByIds((article.related_kuliner_ids ?? []).slice(0, isHub ? 20 : undefined))
	]);

	if (isHub) {
		// Template hub: hanya tampilkan yang diinput admin, tidak ada fallback random
		return { article, related, relatedVilla, relatedWisata, relatedKuliner };
	}

	// Template artikel: fallback random jika field kosong, tiap reload berbeda
	const [fallbackVilla, fallbackWisata, fallbackKuliner] = await Promise.all([
		relatedVilla.length   ? Promise.resolve([]) : getRandomPlaces('villa',   6),
		relatedWisata.length  ? Promise.resolve([]) : getRandomPlaces('wisata',  6),
		relatedKuliner.length ? Promise.resolve([]) : getRandomPlaces('kuliner', 6)
	]);

	return {
		article,
		related,
		relatedVilla:   relatedVilla.length   ? relatedVilla   : fallbackVilla,
		relatedWisata:  relatedWisata.length  ? relatedWisata  : fallbackWisata,
		relatedKuliner: relatedKuliner.length ? relatedKuliner : fallbackKuliner
	};
};
