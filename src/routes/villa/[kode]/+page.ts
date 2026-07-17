import { getVillaByKode, getRelatedVillas, getNearbyWithFallback } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const place = await getVillaByKode(params.kode);
	if (!place) throw error(404, 'Villa tidak ditemukan');
	const [related, nearbyVilla, nearbyWisata, nearbyKuliner] = await Promise.all([
		getRelatedVillas(params.kode, 8),
		getNearbyWithFallback('villa',   place.nearby_villa_ids,   place.lokasi, place.id),
		getNearbyWithFallback('wisata',  place.nearby_wisata_ids,  place.lokasi, place.id),
		getNearbyWithFallback('kuliner', place.nearby_kuliner_ids, place.lokasi, place.id)
	]);
	return { place, related, nearbyVilla, nearbyWisata, nearbyKuliner };
};
