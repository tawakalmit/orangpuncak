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
		published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()
	};
}

export function validateArticle(record: { title: string }): string | null {
	if (!record.title) return 'Judul wajib diisi.';
	return null;
}
