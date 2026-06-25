import { getCategories, getLocations, getPlaces } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('kategori') ?? '';
	const lokasi = url.searchParams.get('lokasi') ?? '';

	const [places, categories, locations] = await Promise.all([
		getPlaces('kuliner', { q, category, lokasi }),
		getCategories('kuliner'),
		getLocations('kuliner')
	]);

	return { places, categories, locations, filter: { q, category, lokasi } };
};
