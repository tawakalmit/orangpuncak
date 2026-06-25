import { getPlaceBySlug, getRelated } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const place = await getPlaceBySlug('wisata', params.slug);
	if (!place) throw error(404, 'Tempat wisata tidak ditemukan');
	const related = await getRelated('wisata', params.slug, 8);
	return { place, related };
};
