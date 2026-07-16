import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) return { leads: [] };
	const { data } = await locals.supabase
		.from('ad_leads')
		.select('*')
		.order('created_at', { ascending: false });
	return { leads: data ?? [] };
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const status = String(form.get('status') ?? 'new');
		const { error } = await locals.supabase.from('ad_leads').update({ status }).eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
};
