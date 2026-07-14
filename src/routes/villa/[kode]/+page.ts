import { getPlacesByIds, getRelatedVillas, getVillaByKode } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const place = await getVillaByKode(params.kode);
	if (!place) throw error(404, 'Villa tidak ditemukan');
	const [related, nearbyVilla, nearbyWisata, nearbyKuliner] = await Promise.all([
		getRelatedVillas(params.kode, 8),
		getPlacesByIds(place.nearby_villa_ids ?? []),
		getPlacesByIds(place.nearby_wisata_ids ?? []),
		getPlacesByIds(place.nearby_kuliner_ids ?? [])
	]);
	return { place, related, nearbyVilla, nearbyWisata, nearbyKuliner };
};
