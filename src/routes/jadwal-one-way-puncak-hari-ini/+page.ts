import { getArticles, getLatestPlaces } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const [latestWisata, latestVilla, latestKuliner, articles] = await Promise.all([
		getLatestPlaces('wisata', 4),
		getLatestPlaces('villa', 4),
		getLatestPlaces('kuliner', 4),
		getArticles({ limit: 3 })
	]);

	return {
		latestWisata,
		latestVilla,
		latestKuliner,
		articles: articles.articles
	};
};
