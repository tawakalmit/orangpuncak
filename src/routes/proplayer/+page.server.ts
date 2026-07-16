import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sb = locals.supabase;
	if (!sb) return { counts: null };

	const [villa, wisata, kuliner, articles, leads, newLeads] = await Promise.all([
		sb.from('places').select('id', { count: 'exact', head: true }).eq('type', 'villa'),
		sb.from('places').select('id', { count: 'exact', head: true }).eq('type', 'wisata'),
		sb.from('places').select('id', { count: 'exact', head: true }).eq('type', 'kuliner'),
		sb.from('articles').select('id', { count: 'exact', head: true }),
		sb.from('ad_leads').select('id', { count: 'exact', head: true }),
		sb.from('ad_leads').select('id', { count: 'exact', head: true }).eq('status', 'new')
	]);

	return {
		counts: {
			villa: villa.count ?? 0,
			wisata: wisata.count ?? 0,
			kuliner: kuliner.count ?? 0,
			articles: articles.count ?? 0,
			leads: leads.count ?? 0,
			newLeads: newLeads.count ?? 0
		}
	};
};
