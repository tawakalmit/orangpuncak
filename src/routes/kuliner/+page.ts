import { getCategories, getLocations, getPlacesPaginated } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('kategori') ?? '';
	const lokasi = url.searchParams.get('lokasi') ?? '';

	const [{ places, hasMore, total }, categories, locations] = await Promise.all([
		getPlacesPaginated('kuliner', { q, category, lokasi, page: 0, limit: 8 }),
		getCategories('kuliner'),
		getLocations('kuliner')
	]);

	return { places, hasMore, total, categories, locations, filter: { q, category, lokasi } };
};
