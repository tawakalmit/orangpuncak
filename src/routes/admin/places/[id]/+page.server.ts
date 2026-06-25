import { parsePlaceForm, validatePlace } from '$lib/server/places';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.supabase) throw error(500, 'Supabase belum dikonfigurasi.');
	const { data, error: err } = await locals.supabase
		.from('places')
		.select('*')
		.eq('id', params.id)
		.maybeSingle();
	if (err || !data) throw error(404, 'Data tidak ditemukan');
	return { place: data };
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const record = parsePlaceForm(form);
		const invalid = validatePlace(record);
		if (invalid) return fail(400, { error: invalid });

		const { error: err } = await locals.supabase.from('places').update(record).eq('id', params.id);
		if (err) return fail(500, { error: err.message });

		throw redirect(303, '/admin/places');
	},
	delete: async ({ locals, params }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const { error: err } = await locals.supabase.from('places').delete().eq('id', params.id);
		if (err) return fail(500, { error: err.message });
		throw redirect(303, '/admin/places');
	}
};
