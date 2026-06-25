import { getArticles, getFeaturedPlaces, getLatestPlaces } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const [featuredVillas, featuredWisata, latestVilla, articles] = await Promise.all([
		getFeaturedPlaces('villa', 4),
		getFeaturedPlaces('wisata', 4),
		getLatestPlaces('villa', 8),
		getArticles(3)
	]);

	return {
		featured: [...featuredVillas, ...featuredWisata].slice(0, 8),
		latestVilla,
		articles
	};
};
