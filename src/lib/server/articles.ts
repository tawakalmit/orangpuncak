import { slugify } from './places';

export function parseArticleForm(form: FormData) {
	const title = String(form.get('title') ?? '').trim();
	const slugInput = String(form.get('slug') ?? '').trim();
	const tagsRaw = String(form.get('tags') ?? '').trim();
	const publishedAt = String(form.get('published_at') ?? '').trim();

	return {
		title,
		slug: slugInput ? slugify(slugInput) : slugify(title),
		excerpt: String(form.get('excerpt') ?? '').trim() || null,
		content: String(form.get('content') ?? '').trim() || null,
		cover_image: String(form.get('cover_image') ?? '').trim() || null,
		tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [],
		published: form.get('published') !== null ? form.get('published') === 'on' : true,
		published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
		template: (String(form.get('template') ?? 'artikel') === 'hub' ? 'hub' : 'artikel') as 'artikel' | 'hub',
		meta_title: String(form.get('meta_title') ?? '').trim() || null,
		meta_description: String(form.get('meta_description') ?? '').trim() || null,
		related_villa_ids: form.getAll('related_villa_ids').map((v) => String(v)).filter(Boolean),
		related_wisata_ids: form.getAll('related_wisata_ids').map((v) => String(v)).filter(Boolean),
		related_kuliner_ids: form.getAll('related_kuliner_ids').map((v) => String(v)).filter(Boolean)
	};
}

export function validateArticle(record: { title: string }): string | null {
	if (!record.title) return 'Judul wajib diisi.';
	return null;
}
