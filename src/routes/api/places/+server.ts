import { getPlacesPaginated } from '$lib/data';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const type = (url.searchParams.get('type') ?? 'wisata') as 'wisata' | 'kuliner' | 'villa';
	const q = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('kategori') ?? '';
	const lokasi = url.searchParams.get('lokasi') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const kamar = parseInt(url.searchParams.get('kamar') ?? '0', 10) || 0;
	const facilities = url.searchParams.getAll('fasilitas');
	const page = parseInt(url.searchParams.get('page') ?? '0', 10);

	const result = await getPlacesPaginated(type, {
		q, category, lokasi,
		status: status || undefined,
		kamar: kamar || undefined,
		facilities: facilities.length ? facilities : undefined,
		page,
		limit: 8
	});
	return json(result);
};
