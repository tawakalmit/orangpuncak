import { getPlacesPaginated } from '$lib/data';
import { LOKASI_OPTIONS } from '$lib/config';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const lokasi = url.searchParams.get('lokasi') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const kamar = parseInt(url.searchParams.get('kamar') ?? '0', 10) || 0;
	const facilities = url.searchParams.getAll('fasilitas');

	const { places, hasMore, total } = await getPlacesPaginated('villa', {
		q, lokasi,
		status: status || undefined,
		kamar: kamar || undefined,
		facilities: facilities.length ? facilities : undefined,
		page: 0,
		limit: 8
	});

	return {
		places, hasMore, total,
		locations: LOKASI_OPTIONS,
		rooms: [2, 3, 4, 5, 6],
		filter: { q, lokasi, status, kamar, facilities }
	};
};
