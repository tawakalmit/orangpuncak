import { getPlaceBySlug, getRelated } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const place = await getPlaceBySlug('kuliner', params.slug);
	if (!place) throw error(404, 'Tempat kuliner tidak ditemukan');
	const related = await getRelated('kuliner', params.slug, 8);
	return { place, related };
};
