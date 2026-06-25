import { getLocations, getVillas } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const [villas, locations] = await Promise.all([getVillas(), getLocations('villa')]);
	const rooms = Array.from(
		new Set(villas.map((v) => v.jumlah_kamar_tidur ?? 0).filter(Boolean))
	).sort((a, b) => a - b);
	return { villas, locations, rooms };
};
