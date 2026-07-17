import { getPlacesPaginated } from '$lib/data';
import { LOKASI_OPTIONS } from '$lib/config';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('kategori') ?? '';
	const lokasi = url.searchParams.get('lokasi') ?? '';

	const { places, hasMore, total } = await getPlacesPaginated('wisata', { q, category, lokasi, page: 0, limit: 8 });

	return { places, hasMore, total, locations: LOKASI_OPTIONS, filter: { q, category, lokasi } };
};
