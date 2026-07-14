import { parsePlaceForm, validatePlace } from '$lib/server/places';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sb = locals.supabase;
	if (!sb) return { allPlaces: [] };
	const { data } = await sb
		.from('places')
		.select('id, name, type')
		.order('name', { ascending: true });
	return { allPlaces: data ?? [] };
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

		throw redirect(303, '/admin/places');
	}
};
