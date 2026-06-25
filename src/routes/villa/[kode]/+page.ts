import { getRelatedVillas, getVillaByKode } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const place = await getVillaByKode(params.kode);
	if (!place) throw error(404, 'Villa tidak ditemukan');
	const related = await getRelatedVillas(params.kode, 8);
	return { place, related };
};
