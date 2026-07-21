import { SITE_URL } from '$lib/config';
import { getArticles, getPlaces } from '$lib/data';
import type { RequestHandler } from './$types';

export const prerender = false;

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function iso(date?: string | null): string | undefined {
	if (!date) return undefined;
	const d = new Date(date);
	return isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0];
}

export const GET: RequestHandler = async () => {
	const [wisata, villa, kuliner, { articles }] = await Promise.all([
		getPlaces('wisata'),
		getPlaces('villa'),
		getPlaces('kuliner'),
		getArticles({ limit: 1000 })
	]);

	const staticEntries: UrlEntry[] = [
		{ loc: '', changefreq: 'daily', priority: '1.0' },
		{ loc: '/wisata', changefreq: 'daily', priority: '0.9' },
		{ loc: '/villa', changefreq: 'daily', priority: '0.9' },
		{ loc: '/kuliner', changefreq: 'daily', priority: '0.9' },
		{ loc: '/artikel', changefreq: 'daily', priority: '0.8' },
		{ loc: '/jadwal-one-way-puncak-hari-ini', changefreq: 'daily', priority: '0.8' },
		{ loc: '/iklan', changefreq: 'monthly', priority: '0.7' },
		{ loc: '/cara-booking', changefreq: 'monthly', priority: '0.5' },
		{ loc: '/cara-survey', changefreq: 'monthly', priority: '0.5' },
		{ loc: '/tentang', changefreq: 'yearly', priority: '0.4' },
		{ loc: '/kontak', changefreq: 'yearly', priority: '0.4' }
	];

	const entries: UrlEntry[] = [
		...staticEntries,
		...villa.map((p) => ({ loc: `/villa/${p.kode}`, lastmod: iso(p.updated_at ?? p.created_at), changefreq: 'weekly', priority: '0.8' })),
		...wisata.map((p) => ({ loc: `/wisata/${p.slug}`, lastmod: iso(p.updated_at ?? p.created_at), changefreq: 'weekly', priority: '0.7' })),
		...kuliner.map((p) => ({ loc: `/kuliner/${p.slug}`, lastmod: iso(p.updated_at ?? p.created_at), changefreq: 'weekly', priority: '0.7' })),
		...articles.map((a) => ({ loc: `/artikel/${a.slug}`, lastmod: iso(a.updated_at ?? a.published_at), changefreq: 'monthly', priority: '0.6' }))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map((e) => {
		const parts = [`\t\t<loc>${SITE_URL}${e.loc}</loc>`];
		if (e.lastmod) parts.push(`\t\t<lastmod>${e.lastmod}</lastmod>`);
		if (e.changefreq) parts.push(`\t\t<changefreq>${e.changefreq}</changefreq>`);
		if (e.priority) parts.push(`\t\t<priority>${e.priority}</priority>`);
		return `\t<url>\n${parts.join('\n')}\n\t</url>`;
	})
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
