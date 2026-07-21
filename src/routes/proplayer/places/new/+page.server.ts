import { parsePlaceForm, validatePlace } from '$lib/server/places';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sb = locals.supabase;
	if (!sb) return { allPlaces: [], allCategories: [], allVillaComplexes: [] };
	const [{ data: places }, { data: cats }, { data: complexes }] = await Promise.all([
		sb.from('places').select('id, name, type').order('name', { ascending: true }),
		sb.from('places').select('categories').not('categories', 'is', null),
		sb.from('places').select('villa_complexes').eq('type', 'villa').not('villa_complexes', 'is', null)
	]);

	const allCategories = [...new Set((cats ?? []).flatMap((r) => r.categories ?? []).filter(Boolean))].sort() as string[];
	const allVillaComplexes = [...new Set((complexes ?? []).flatMap((r: { villa_complexes?: string[] | null }) => r.villa_complexes ?? []).filter(Boolean))].sort() as string[];

	return { allPlaces: places ?? [], allCategories, allVillaComplexes };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const record = parsePlaceForm(form);
		const invalid = validatePlace(record);
		if (invalid) return fail(400, { error: invalid });

		const { error } = await locals.supabase.from('places').insert(record);
		if (error) return fail(500, { error: error.message });

		throw redirect(303, '/proplayer/places');
	}
};
