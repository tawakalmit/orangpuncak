import { getLocations, getPlacesPaginated } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const lokasi = url.searchParams.get('lokasi') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const kamar = parseInt(url.searchParams.get('kamar') ?? '0', 10) || 0;
	const facilities = url.searchParams.getAll('fasilitas');

	const [{ places, hasMore, total }, locations] = await Promise.all([
		getPlacesPaginated('villa', {
			q, lokasi,
			status: status || undefined,
			kamar: kamar || undefined,
			facilities: facilities.length ? facilities : undefined,
			page: 0,
			limit: 8
		}),
		getLocations('villa')
	]);

	// rooms tetap dari semua villa untuk opsi filter — ambil distinct values
	const roomOptions = [2, 3, 4, 5, 6];

	return {
		places, hasMore, total,
		locations,
		rooms: roomOptions,
		filter: { q, lokasi, status, kamar, facilities }
	};
};
